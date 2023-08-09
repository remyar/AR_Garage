import createAction from '../../middleware/actions';

export async function setNewCLient(_client = {}, { extra, getState }) {

    const database = extra.database;

    try {

        await database.saveClient(_client);
        
        return { 
            client : _client
        };
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(setNewCLient);