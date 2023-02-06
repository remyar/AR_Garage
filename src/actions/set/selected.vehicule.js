import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function setSelectedVehicule(vehicule = {} , { extra, getState }) {
    const api = extra.api;
    try {
        let _result = ipcRenderer.sendSync("tecdoc.getVehiculeByCarId" , vehicule.tecdocId);

        vehicule.tecdoc = {
            manuId : _result.vehicleDetails.manuId,
            modelId : _result.vehicleDetails.modId,
            carId : _result.vehicleDetails.carId
        }
        return { selectedVehicule : {...vehicule}};
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(setSelectedVehicule);