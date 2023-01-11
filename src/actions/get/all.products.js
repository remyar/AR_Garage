import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function getAllProducts({ extra, getState }) {
    try {
        let products = ipcRenderer.sendSync("database.getAllProducts");
        return { products : products};
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getAllProducts);