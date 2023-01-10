import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function editClient(_client = {}, { extra, getState }) {

    try {
        let client = ipcRenderer.sendSync("database.saveClient", _client);

        return { client : client};
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(editClient);