import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function setNewProduct(value = {}, { extra, getState }) {
    try {
        let product = ipcRenderer.sendSync("database.saveProduct", value);

        return { product : product};
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(setNewProduct);