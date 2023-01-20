import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function getMotorisations(manuId , { extra, getState }) {

    try {

        let vehicles = ipcRenderer.sendSync("tecdoc.getVehicle", manuId);

        return { motorisation : vehicles };
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getMotorisations);