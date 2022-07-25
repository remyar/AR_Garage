import createAction from '../../middleware/actions';

export async function getArticleIdsWithState(carId, assemblyGroupNodeId , { extra, getState }) {

    const api = extra.api;
    try {
        let articles = [];
        let result = await api.tecdoc.getArticleIdsWithState(carId, assemblyGroupNodeId , 1);
        articles = [...result.articles];

        for ( let i = 2 ; i <= result.maxAllowedPage ; i++){
            result = await api.tecdoc.getArticleIdsWithState(carId, assemblyGroupNodeId , i);
            articles = [...articles , ...result.articles ];
        }

        return { articlesWithState : articles };

    } catch (err) {

        throw { message: err.message };

    }
}

export default createAction(getArticleIdsWithState);