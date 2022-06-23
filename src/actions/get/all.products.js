import createAction from '../../middleware/actions';

export async function getAllProducts({ extra, getState }) {
    try {
        const state = getState();
        return { products : state.products};
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getAllProducts);