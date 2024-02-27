import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function getModelFromTecdocId(id, { extra, getState }) {

    try {
        let models = await ipcRenderer.invoke("technics.getModelFromTecdocId", id);
        return {
            model: models[0] || undefined
        }

    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getModelFromTecdocId);


