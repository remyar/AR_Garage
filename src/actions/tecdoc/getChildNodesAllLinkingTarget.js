import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function getChildNodesAllLinkingTarget(carId, { extra, getState }) {

    const api = extra.api;

    try {
        let _childNodesAllLinkingTarget = ipcRenderer.sendSync("tecdoc.getChildNodesAllLinkingTarget");
        let childNodesAllLinkingTarget = [..._childNodesAllLinkingTarget];
        if (carId) {

            let result = ipcRenderer.sendSync("tecdoc.getAssemblyGroupFacets", carId);

            result.forEach((cat) => {
                let _f = childNodesAllLinkingTarget.find((_ct) => _ct.assemblyGroupNodeId == cat.assemblyGroupNodeId);
                if (_f && cat.count > 0) {
                    _f.hasArticles = true;

                    if ( _f.parentNodeId != undefined ){
                        let __f = childNodesAllLinkingTarget.find((_ct) => _ct.assemblyGroupNodeId == _f.parentNodeId);
                        __f.hasArticles = true;
                        if ( __f.parentNodeId != undefined ){
                            let ___f = childNodesAllLinkingTarget.find((_ct) => _ct.assemblyGroupNodeId == __f.parentNodeId);
                            ___f.hasArticles = true;
                            if ( ___f.parentNodeId != undefined ){
                                let ____f = childNodesAllLinkingTarget.find((_ct) => _ct.assemblyGroupNodeId == ___f.parentNodeId);
                                ____f.hasArticles = true;
                            }
                        }
                    }
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