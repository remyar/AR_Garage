import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function setSelectedVehicule(vehicule = {}, { extra, getState }) {
    const api = extra.api;
    try {
        let _result = ipcRenderer.sendSync("tecdoc.getVehiculeByCarId", vehicule.tecdocId);

        if (_result.length == 0) {
            throw Error("not existing in tecdoc database")
        }else {
            vehicule.tecdoc = {
                manuId: _result[0].manuId,
                modelId: _result[0].modId,
                carId: _result[0].carId
            }
            return { selectedVehicule: { ...vehicule } };
        }
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(setSelectedVehicule);