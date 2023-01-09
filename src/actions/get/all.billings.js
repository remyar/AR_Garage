import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';
export async function getAllFactures({ extra, getState }) {
    try {
        let factures = [];
        ipcRenderer.invoke("executeQuery","SELECT * from tables;") // Do this

        return { factures : factures};
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getAllFactures);