import createAction from '../../middleware/actions';
import _childNodesAllLinkingTarget from '../../data/tecdoc/childNodesAllLinkingTarget.json';

export async function getChildNodesAllLinkingTarget(carId, { extra, getState }) {

    const api = extra.api;
    let childNodesAllLinkingTarget = _childNodesAllLinkingTarget;
    try {

        if (carId) {
            let result = await api.tecdoc.getCategories(carId);

            result.assemblyGroupFacets.counts.forEach((cat) => {
                let _f = childNodesAllLinkingTarget.find((_ct) => _ct.assemblyGroupNodeId == cat.assemblyGroupNodeId);
                if (cat.count > 0) {
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