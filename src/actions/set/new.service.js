import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function setNewService(value = {}, { extra, getState }) {
    try {
        let service = ipcRenderer.sendSync("database.saveService",value);
        return { service : service};
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(setNewService);