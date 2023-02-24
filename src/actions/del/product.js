import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';


export async function deleteProduct(id, { extra, getState }) {
    try {
        ipcRenderer.sendSync("database.saveProduitsDeleted", id);
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(deleteProduct);