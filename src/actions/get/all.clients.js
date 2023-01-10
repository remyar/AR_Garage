import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function getAllClients({ extra, getState }) {
    try {
        let clients = ipcRenderer.sendSync("database.getAllClients");
        
        return {
            clients : clients
        }

    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getAllClients);