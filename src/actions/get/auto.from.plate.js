import createAction from '../../middleware/actions';

export async function getAutoFromPlate(plate = "AA-456-BB", { extra, getState }) {
    const api = extra.api;
    const database = extra.database;
    const settings = getState().settings;

    try {
        let vehicule = await database.getVehiculeByPlate(plate);

        vehicule = { ...vehicule };

        let reparCarInfos = await api.post("https://www.reparcar.fr/api/public/v1/search/immat/0?immat=" + plate);
        vehicule.plate = plate;
        vehicule.engineCode = reparCarInfos?.registration_info?.engine_code || vehicule.engineCode;
        vehicule.immatriculationDate = reparCarInfos?.registration_info?.date_pme || vehicule.immatriculationDate;
        vehicule.model = reparCarInfos?.car_identification?.model || vehicule?.model;
        vehicule.brand = reparCarInfos?.car_identification?.brand || vehicule?.brand;
        vehicule.vin = reparCarInfos?.car_identification?.vin || vehicule?.vin;
        vehicule.puissance = reparCarInfos?.registration_info?.real_power || vehicule?.puissance;
        vehicule.energy = reparCarInfos?.registration_info?.energy_name || vehicule?.energy;
        vehicule.designation = reparCarInfos?.ms_vehicle?.version?.fullName ? reparCarInfos?.ms_vehicle?.version?.fullName : ((vehicule?.brand + " " + vehicule?.model) || "");
        vehicule.designation += " ";
        vehicule.designation += reparCarInfos?.registration_info?.version ? ("( " + reparCarInfos?.registration_info?.version + " )") : "";

        vehicule.tecdocId = reparCarInfos?.car_identification?.ktypnr || undefined;

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