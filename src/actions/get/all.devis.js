import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function getAllDevis({ extra, getState }) {
    try {
        let devis = ipcRenderer.sendSync("database.getAlldevis");
        
        return { devis : devis};
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getAllDevis);