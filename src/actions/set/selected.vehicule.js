import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function setSelectedVehicule(vehicule = {}, { extra, getState }) {
    const api = extra.api;
    try {
        let _result = ipcRenderer.sendSync("tecdoc.getVehiculeByCarId", vehicule.tecdocId);

        if (_result.carId == undefined) {
            throw Error("not existing in tecdoc database")
        }else {
            vehicule.tecdoc = {
                manuId: _result.manuId,
                modelId: _result.modId,
                carId: _result.carId
            }
            return { selectedVehicule: { ...vehicule } };
        }
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(setSelectedVehicule);