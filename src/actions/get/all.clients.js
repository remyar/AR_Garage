import createAction from '../../middleware/actions';


export async function getAllClients({ extra, getState }) {
    const database = extra.database;

    try {
        let clients = await database.getAllClients();
        
        return {
            clients : clients
        }

    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getAllClients);