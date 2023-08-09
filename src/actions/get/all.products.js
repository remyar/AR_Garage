import createAction from '../../middleware/actions';

export async function getAllProducts({ extra, getState }) {
    const database = extra.database;

    try {
        let _products = await database.getAllProducts();
        
        return {
            products : _products
        }

    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getAllProducts);