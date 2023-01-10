import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function getAllFactures({ extra, getState }) {
    try {

        let factures = ipcRenderer.sendSync("database.getAllFactures");

        return { factures : factures};
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getAllFactures);