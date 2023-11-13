import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function getMotorByModelId(id, { extra, getState }) {
    const database = extra.database;

    try {
        let motors = await ipcRenderer.invoke("technics.getMotorByModelId", id);
        return {
            motors: motors
        }

    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getMotorByModelId);