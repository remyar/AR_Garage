import createAction from '../../middleware/actions';

export async function deleteProduct(id, { extra, getState }) {
    try {
        let state = getState();
        state.products.forEach((el,idx) => {
            if ( el.id == id){
                state.products[idx].deleted = 1;
            }
        });
        return { products : state.products}
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(deleteProduct);