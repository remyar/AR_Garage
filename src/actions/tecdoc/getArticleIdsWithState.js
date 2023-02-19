import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function getArticleIdsWithState(carId, assemblyGroupNodeId, { extra, getState }) {

    const api = extra.api;
    try {
        let articles = [];
        let result = ipcRenderer.sendSync("tecdoc.getArticleIdsWithState", { carId, assemblyGroupNodeId });

        for (let _r of result) {
            let articleLinks = ipcRenderer.sendSync("tecdoc.getArticleLinkIds", _r.articleId);

            articleLinks.forEach(element => {
                if (element.articleDocuments != undefined && element?.articleDocuments?.array != undefined) {
                    for (let document of element?.articleDocuments?.array) {
                        let r = ipcRenderer.sendSync("tecdoc.getArticleDocuments", document.docId);
                        document.document = r;
                    }
                }
                if (element.articleThumbnails != undefined && element?.articleThumbnails?.array != undefined ) {
                    for (let document of element?.articleThumbnails?.array) {
                        let r = ipcRenderer.sendSync("tecdoc.getArticleDocuments", document.thumbDocId);
                        document.document = r;
                    }
                }
                articles.push({..._r , ...element});
            });

        }

        return { articlesWithState: articles };

    } catch (err) {

        throw { message: err.message };

    }
}

export default createAction(getArticleIdsWithState);