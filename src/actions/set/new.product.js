import createAction from '../../middleware/actions';

export async function setNewProduct(value = {}, { extra, getState }) {
    try {
        let state = getState();
        let products = state.products;
        products.push({...value , id : products.length})
        return { products : products};
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(setNewProduct);