import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function getAutoFromPlate(plate = "AA-456-BB", { extra, getState }) {
    const api = extra.api;
    try {

        let vehicule = ipcRenderer.sendSync("database.getVehiculeFromPlate", plate);

        if (vehicule == undefined || vehicule.tecdocId == undefined) {

            let tecdocData = ipcRenderer.sendSync("fetch.get", { url: process.env.REACT_APP_URL_9 + plate });
            let vehiculeDetails = undefined;
            if ((tecdocData.vehicule.length > 0) && tecdocData.vehicule[0]?.id) {
                vehiculeDetails = ipcRenderer.sendSync("tecdoc.getVehiculeDetailByCarId", tecdocData.vehicule[0]?.id);
                vehiculeDetails = vehiculeDetails.vehicleDetails;
               /* vehiculeDetails.manuName = vehiculeDetails.uriPlate.split("/")[2].toUpperCase();*/
            }

            vehicule = {
                tecdocId: vehiculeDetails?.carId || undefined,
                brand: vehiculeDetails?.manuName ? vehiculeDetails?.manuName : vehicule.brand,
                model: vehiculeDetails?.modelName ? vehiculeDetails?.modelName : vehicule.model,
                puissance: vehiculeDetails?.powerHpFrom ? vehiculeDetails?.powerHpFrom : vehicule.puissance,
                phase: undefined,
                designation:  vehiculeDetails?.manuName && vehiculeDetails?.modelName && vehiculeDetails?.powerHpFrom ? (vehiculeDetails?.manuName + " " + vehiculeDetails?.modelName + " " + vehiculeDetails?.powerHpFrom + " cv") : vehicule.designation,
                engineCode: tecdocData?.engineNumber.length > 0 ? tecdocData?.engineNumber[0] : vehicule.engineCode,
                gearboxCode: undefined,
                immatriculationDate: tecdocData?.firstRegistrationDate ? tecdocData?.firstRegistrationDate : vehicule.immatriculationDate,
                vin: tecdocData?.vin ? tecdocData?.vin : vehicule.vin,
                energy: vehiculeDetails?.fuelType ? vehiculeDetails?.fuelType : vehicule.energy,
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