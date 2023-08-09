import createAction from '../../middleware/actions';

export async function saveProduct(value = {}, { extra, getState }) {
    const database = extra.database;
    const api = extra.api;
    const settings = getState().settings;
    try {

        await database.saveProduct(value);
        return {
            product: value
        };
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(saveProduct);