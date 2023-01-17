import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function getAllMarques({ extra, getState }) {
    try {
        let marques = ipcRenderer.sendSync("database.getAllMarques");
        return { marques : marques};
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getAllMarques);