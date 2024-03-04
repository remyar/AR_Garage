import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function getAllComponentsByTypeId(_id,{ extra, getState }) {

    try {
        let components = await ipcRenderer.invoke("technics.getAllComponentsByTypeId", _id);

        return {
            components: components || []
        }
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getAllComponentsByTypeId);