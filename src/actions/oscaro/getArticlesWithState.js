import createAction from '../../middleware/actions';
import { parse } from 'node-html-parser';

export async function getArticlesWithState(carId, assemblyGroupNodeId, { extra, getState }) {

    const api = extra.api;
    try {
        let articles = [];

        await api.get(process.env.REACT_APP_OSCARO_API_URL_1);
        await api.get(process.env.REACT_APP_OSCARO_API_URL_2);
        let result = await api.post("https://www.oscaro.com/xhr/eiffel/fr/fr", { 'eiffel-canonical-keys': [{ "category-id": assemblyGroupNodeId, "significant-vehicle": true, "vid": carId }] }, { headers: { "content-type": "application/json" } });

        let page = await api.get(result.results[0].url);
        const root = await parse(page);
        let queryResult = root.querySelectorAll('#listProduct > article');
        for ( let element of queryResult ){
            let obj = {};

            element.querySelectorAll("meta").forEach((el) => {
                obj[el.attributes.itemProp] = el.attributes.content;
            });

            obj.images=[];
           // obj.images.push(element.querySelector("figure > img").attributes.src);
            obj.marque = element.querySelector(".product-title > a > .brand").text;

            let __detailProduct = await api.get(obj.url);
            const __root = await parse(__detailProduct);
            __root.querySelectorAll(".thumbnails > li > .thumbnail > img").forEach((_element) => {
                obj.images.push(_element.attributes.src.replace('/vignettes130/' , '/zoom/'));
            });

            __root.querySelector(".information-collapse-content > .unstyled > .list-ref").forEach((_element) => {
                    console.log(_element);
            });
            articles.push(obj);
        }

        return { articlesWithState: articles };

    } catch (err) {

        throw { message: err.message };

    }
}

export default createAction(getArticlesWithState);