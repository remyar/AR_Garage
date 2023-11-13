import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function getAllManufacturers({ extra, getState }) {
    const api = extra.api;

    try {
        let manufacturers = await ipcRenderer.invoke("technics.getManufacturers");

        return {
            manufacturers: manufacturers || []
        }

    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getAllManufacturers);