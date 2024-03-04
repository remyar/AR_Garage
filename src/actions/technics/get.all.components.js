import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function getAllComponents({ extra, getState }) {

    try {
        let components = await ipcRenderer.invoke("technics.getAllComponents");

        return {
            components: components || []
        }
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getAllComponents);