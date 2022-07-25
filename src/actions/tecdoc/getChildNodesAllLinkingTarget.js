import createAction from '../../middleware/actions';
import childNodesAllLinkingTarget from '../../data/tecdoc/childNodesAllLinkingTarget.json';

export async function getChildNodesAllLinkingTarget({ extra, getState }) {

    try {
        
        return { catalog : childNodesAllLinkingTarget };

    } catch (err) {

        throw { message: err.message };

    }
}

export default createAction(getChildNodesAllLinkingTarget);