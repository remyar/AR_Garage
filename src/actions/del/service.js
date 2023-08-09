import createAction from '../../middleware/actions';

export async function delService(idToDelete, { extra, getState }) {

    const database = extra.database;

    try {
        let data = await database.getServiceById(idToDelete);
        if ( data != undefined ){
            data.deleted = true;
        }
        await database.saveService(data);
        return { 
            service : data
        };
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(delService);