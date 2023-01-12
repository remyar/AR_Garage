import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function getAllServices({ extra, getState }) {
    try {
        let services = ipcRenderer.sendSync("database.getAllServices");
        return { services: services };
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getAllServices);