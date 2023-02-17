import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function getArticleIdsWithState(carId, assemblyGroupNodeId, { extra, getState }) {

    const api = extra.api;
    try {
        let articles = [];
        let result = ipcRenderer.sendSync("tecdoc.getArticleIdsWithState", { carId, assemblyGroupNodeId });

        for (let _r of result) {
            let articleLinks = ipcRenderer.sendSync("tecdoc.getArticleLinkIds", _r.articleId);

            let documents = [];
            articleLinks.forEach(element => {
                if (element.articleDocuments != undefined) {
                    for (let document of element?.articleDocuments?.array) {
                        let r = ipcRenderer.sendSync("tecdoc.getArticleDocuments", document.docId);
                        documents.push(r);
                    }
                }
            });

            documents = documents.flat();

            documents.forEach(element => {
                if (element?.docTypeId == 1) {
                    //-- image
                    //let image = ipcRenderer.sendSync("images.getDocument",element.docId);
                    element.url = "https://webservice.tecalliance.services/pegasus-3-0/documents/" + process.env.REACT_APP_TECDOC_PROVIDER_ID_NEW + "/" + element.docId
                }
            });
            documents = documents.filter((el => el != undefined));
            _r.documents = [...documents];
        }

        articles = [...result];

        return { articlesWithState: articles };

    } catch (err) {

        throw { message: err.message };

    }
}

export default createAction(getArticleIdsWithState);