import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function setNewMarque(value = {}, { extra, getState }) {

    try {
        let marque = ipcRenderer.sendSync("database.saveMarque",value);
        return { marque: marque };
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(setNewMarque);