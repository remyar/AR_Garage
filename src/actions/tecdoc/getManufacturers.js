import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function getManufacturers({ extra, getState }) {

    try {
        let manufacturers = ipcRenderer.sendSync("tecdoc.getManufacturers");

        return { manufacturers: manufacturers };
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getManufacturers);