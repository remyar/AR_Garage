import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';
import actions from '../../actions';

export async function getAutoFromPlate(plate = "AA-456-BB", { dispatch , extra, getState }) {
    const api = extra.api;
    const database = extra.database;

    try {
        let vehicule = await database.getVehiculeByPlate(plate);

        vehicule = { ...vehicule };

        let vehiculeInfos = await ipcRenderer.invoke("fetch.get", { url: process.env.REACT_APP_REPARCAR_API_URL_2 + plate });

        if ( vehiculeInfos.message && vehiculeInfos.stack){
            throw Error(vehiculeInfos);
        }

        if (vehiculeInfos) {
            
            let vehicleDetails = await ipcRenderer.invoke("database.getVehicleDetails", vehiculeInfos?.vehicule[0]?.id );
            vehicleDetails = vehicleDetails[0]?.vehicleDetails || {};

            vehicule.plate = plate;
            vehicule.engineCode = vehiculeInfos.engineNumber[0] || vehicule.engineCode;
            vehicule.immatriculationDate = vehiculeInfos.firstRegistrationDate || vehicule.immatriculationDate;
            vehicule.model = vehicleDetails?.modelName || vehicule.model;
            vehicule.brand = vehicleDetails?.manuName || vehicule.brand;
            vehicule.vin = vehiculeInfos.vin || vehicule.vin;
            vehicule.puissance = vehicleDetails?.powerHpTo || vehicule.puissance;
            vehicule.energy = vehicleDetails?.fuelType || vehicule.energy;
            vehicule.designation = (vehicleDetails?.manuName || vehicule.brand)  + " " + (vehicleDetails?.modelName || vehicule.model) + " " + (vehicleDetails?.typeName || '');
            vehicule.tecdocId = vehiculeInfos.vehicule[0]?.id;
            vehicule.engineCode = vehiculeInfos.engineNumber[0] || "";
        }

        if (vehicule.tecdocId != undefined){
            try {
                let data = await dispatch(actions.technics.getModelByTecdocId(vehicule.tecdocId));
                let model = data?.model || {};
                if (model.imageId) {
                    let image = await dispatch(actions.get.images(model.imageId));
                    vehicule.image = { ...image.image }
                }
            } catch(err){
                vehicule.image = undefined;
            }
        }

        vehicule.deleted = false;

        await database.saveVehicule(vehicule);

        return {
            vehicule: vehicule
        }
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getAutoFromPlate);