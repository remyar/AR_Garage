import createAction from '../../middleware/actions';


export async function getAllCategories({ extra, getState }) {
    try {
        const state = getState();
        return { categories : state.categories};
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getAllCategories);