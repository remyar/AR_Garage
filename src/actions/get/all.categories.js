import createAction from '../../middleware/actions';
import childNodesAllLinkingTarget from '../../data/tecdoc/childNodesAllLinkingTarget.json';

export async function getAllCategories({ extra, getState }) {
    try {
        return { categories : childNodesAllLinkingTarget};
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getAllCategories);