import createAction from '../../middleware/actions';
import technics from '../../data/technics.json';

export async function getAllVehicules({ extra, getState }) {
    try {
        const api = extra.api;
        const state = getState();

        //-- check and upgrade old vehicule with tecdoc model
        for (let i = 0; i < state.vehicules.length; i++) {
            if (state.vehicules[i].plate && !state.vehicules[i].vehicleDetails) {

                //-- old model
                try {

                    let vehicule = {};
                    await api.get(process.env.REACT_APP_OSCARO_API_URL_1);
                    await api.get(process.env.REACT_APP_OSCARO_API_URL_2);
                    let result = await api.get(process.env.REACT_APP_OSCARO_API_URL_3 + state.vehicules[i].plate.replace('-', '').replace('-', ''));
                    let oscaroData =(await api.get(process.env.REACT_APP_OSCARO_API_URL_34 + result["vehicle-identity"]))["vehicle-info"] || {};

                    let tecdocData = (await api.tecdoc.getVehiclesByKeyVin(oscaroData?.vin || ""))[0] || {};


                    result = await api.tecdoc.getVehicleByIds4(tecdocData.carId);

                    vehicule.carName = tecdocData.carName;
                    vehicule.carId = tecdocData.carId;
                    vehicule.manuId = tecdocData.manuId;
                    vehicule.modelId = tecdocData.modelId;
                    vehicule.vehicleDetails = {
                        ...result.vehicleDetails,
                        engineCode : oscaroData['engine-code'],
                        gearboxCode : oscaroData['gearbox-code'],
                        mark : result.vehicleDetails.manuName,
                    }
                    if (vehicule.carName?.length > 0 && vehicule.carId != 0 && vehicule.modelId != 0 && vehicule.manuId != 0 ) {
                        state.vehicules[i] = {
                            ...vehicule,
                            deleted: 0,
                            plate: state.vehicules[i].plate
                        };
                    }

                } catch (err) {
                    throw { message: err.message };
                }
            }
        }

        state.vehicules = state.vehicules.map((v) => {
            v.hasTechnics = false;

            let brand = v.vehicleDetails.mark.toUpperCase();
            let engine_code = v.vehicleDetails.engineCode.toUpperCase();

            let _technics = technics[brand];
            if (_technics == undefined) {
                _technics = {};
            }

            if (_technics[engine_code] != undefined) {
                v.hasTechnics = true;
            }

            return v;
        });


        return { vehicules: state.vehicules };
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getAllVehicules);