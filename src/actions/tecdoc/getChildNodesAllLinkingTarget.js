import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function getChildNodesAllLinkingTarget(carId, { extra, getState }) {

    const api = extra.api;

    try {
        let _childNodesAllLinkingTarget = ipcRenderer.sendSync("tecdoc.getChildNodesAllLinkingTarget");
        let childNodesAllLinkingTarget = [..._childNodesAllLinkingTarget];
        if (carId) {
            let result = await api.tecdoc.getCategories(carId);

            result.assemblyGroupFacets.counts.forEach((cat) => {
                let _f = childNodesAllLinkingTarget.find((_ct) => _ct.assemblyGroupNodeId == cat.assemblyGroupNodeId);
                if (_f && cat.count > 0) {
                    _f.hasArticles = true;
                }
            })
        } else {
            childNodesAllLinkingTarget = childNodesAllLinkingTarget.map((p) => { return { ...p, hasArticles: true } });
        }
        return { catalog: childNodesAllLinkingTarget };
    } catch (err) {

        throw { message: err.message };

    }
}

export default createAction(getChildNodesAllLinkingTarget);