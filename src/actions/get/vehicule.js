import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function getVehicule(id, { extra, getState }) {

    const api = extra.api;

    try {
        let vehicule = {};

        let vehicleDetails = await ipcRenderer.invoke("database.getVehicleDetails", id);

        vehicleDetails = vehicleDetails && vehicleDetails[0] && vehicleDetails[0].vehicleDetails || {};
        vehicule.brand = vehicleDetails?.manuName || "";
        vehicule.model = vehicleDetails?.modelName || "";
        vehicule.puissance = vehicleDetails?.powerHpFrom || "";
        vehicule.phase = undefined;
        vehicule.designation = vehicleDetails?.manuName && vehicleDetails?.modelName && vehicleDetails?.powerHpFrom ? (vehicleDetails?.manuName + " " + vehicleDetails?.modelName + " " + vehicleDetails?.powerHpFrom + " cv") : vehicleDetails?.designation;
        vehicule.engineCode = "";
        vehicule.gearboxCode = undefined;
        vehicule.immatriculationDate = "";
        vehicule.vin = "";
        vehicule.energy = vehicleDetails?.fuelType ? vehicleDetails?.fuelType : "";
        vehicule.deleted= 0;

        return {
            vehicule: vehicule
        };
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getVehicule);