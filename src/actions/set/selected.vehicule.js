import createAction from '../../middleware/actions';

export async function setSelectedVehicule(vehicule = {}, { extra, getState }) {
    const api = extra.api;

    try {
        let vehicleDetails = {};

        if (vehicule?.tecdocId) {
        //    let vehicleDetails = await api.get("/database/VehicleDetails/" + vehicule.tecdocId + ".json");
        //    vehicleDetails = vehicleDetails?.data?.array[0]?.vehicleDetails || {};
        }

        if (vehicleDetails?.carId == undefined) {
            vehicule.tecdoc = undefined;
        } else {
            vehicule.tecdoc = {
                manuId: vehicleDetails.manuId,
                modelId: vehicleDetails.modId,
                carId: vehicleDetails.carId
            };
        }

        return {
            selectedVehicule: { ...vehicule }
        };
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(setSelectedVehicule);