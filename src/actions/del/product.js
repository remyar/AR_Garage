import createAction from '../../middleware/actions';

export async function delProduct(idToDelete, { extra, getState }) {

    const database = extra.database;

    try {
        let data = await database.getProductById(idToDelete);
        if ( data != undefined ){
            data.deleted = true;
        }
        await database.saveProduct(data);
        return { 
            product : data
        };
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(delProduct);