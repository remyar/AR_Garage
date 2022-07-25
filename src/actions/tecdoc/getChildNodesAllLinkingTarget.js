import createAction from '../../middleware/actions';
import childNodesAllLinkingTarget from '../../data/tecdoc/childNodesAllLinkingTarget.json';

export async function getChildNodesAllLinkingTarget(carId, { extra, getState }) {

    const api = extra.api;
    try {

        // return { catalog : childNodesAllLinkingTarget };

        let result = await api.tecdoc.getCategories(carId);

        result.assemblyGroupFacets.counts.forEach((cat) => {
            let _f = childNodesAllLinkingTarget.find((_ct) => _ct.assemblyGroupNodeId == cat.assemblyGroupNodeId);
            if (cat.count > 0) {
                _f.hasArticles = true;
            }
        })
        console.log(result);
        console.log(childNodesAllLinkingTarget);

        return { catalog: childNodesAllLinkingTarget };
    } catch (err) {

        throw { message: err.message };

    }
}

export default createAction(getChildNodesAllLinkingTarget);