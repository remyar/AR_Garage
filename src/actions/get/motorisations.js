import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function getMotorisations(manuId, modelId, { extra, getState }) {
    const api = extra.api;

    try {
        let vehicles = ipcRenderer.sendSync("database.getVehicle", modelId);

        return {
            motorisation: vehicles || []
        }

    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getMotorisations);