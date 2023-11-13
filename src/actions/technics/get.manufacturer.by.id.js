import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function getMotorByModelId(id, { extra, getState }) {
    const database = extra.database;

    try {
        let manufacturer = await ipcRenderer.invoke("technics.getManufacturerById", id);
        return {
            manufacturer: manufacturer[0] || undefined
        }

    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getMotorByModelId);