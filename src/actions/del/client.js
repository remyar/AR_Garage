import createAction from '../../middleware/actions';

export async function delCLient(idToDelete, { extra, getState }) {

    const database = extra.database;

    try {
        let client = await database.getClientById(idToDelete);
        if ( client != undefined ){
            client.deleted = true;
        }
        await database.saveClient(client);
        return { 
            client : client
        };
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(delCLient);