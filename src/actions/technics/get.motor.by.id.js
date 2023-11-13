import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function getMotorById(motorId, { extra, getState }) {
    const database = extra.database;

    try {
        let motor = await ipcRenderer.invoke("technics.getMotorById", motorId);
        return {
            motor: motor
        }

    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getMotorById);