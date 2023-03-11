import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function getAutoFromPlate(plate = "AA-456-BB", { extra, getState }) {
    const api = extra.api;
    try {

        let vehicule = ipcRenderer.sendSync("database.getVehiculeFromPlate", plate);

        if (vehicule == undefined || vehicule.tecdocId == undefined) {

            let tecdocData = ipcRenderer.sendSync("fetch.get", { url: process.env.REACT_APP_URL_9 + plate });
            let vehiculeDetails = undefined;
            if (tecdocData.vehicule[0]?.id) {
                vehiculeDetails = ipcRenderer.sendSync("tecdoc.getVehiculeDetailByCarId", tecdocData.vehicule[0]?.id);
                vehiculeDetails = vehiculeDetails.vehicleDetails;
            }

            vehicule = {
                tecdocId: vehiculeDetails.carId || undefined,
                brand: vehiculeDetails.manuName,
                model: vehiculeDetails.modelName,
                puissance: vehiculeDetails.powerHpFrom,
                phase: undefined,
                designation: vehiculeDetails.manuName + " " + vehiculeDetails.modelName + " " + vehiculeDetails.powerHpFrom + " cv",
                engineCode: tecdocData.engineNumber[0],
                gearboxCode: undefined,
                immatriculationDate: tecdocData.firstRegistrationDate,
                vin: tecdocData.vin,
                energy: vehiculeDetails.fuelType,
                deleted: 0,
                plate: plate,
            };

            vehicule = ipcRenderer.sendSync("database.saveVehicule", vehicule);
        }
        return {
            vehicule: { ...vehicule }
        };

    } catch (err) {
        throw { message: err.message || err };
    }
}

export default createAction(getAutoFromPlate);