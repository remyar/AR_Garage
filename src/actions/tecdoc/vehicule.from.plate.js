import createAction from '../../middleware/actions';

export async function getAutoFromPlate(plate = "AA-456-BB", { extra, getState }) {
    const api = extra.api;
    try {
        let state = getState();
        let vehicules = state.vehicules;

        let vehicule = vehicules.find((el) => {
            if (el && el.plate) {
                if (el.plate == plate) {
                    return true;
                }
            }
            return false;
        });

        if (!vehicule) {
            let vehicule = {};
            await api.get(process.env.REACT_APP_OSCARO_API_URL_1);
            await api.get(process.env.REACT_APP_OSCARO_API_URL_2);
            let result = await api.get(process.env.REACT_APP_OSCARO_API_URL_3 + plate.replace('-', '').replace('-', ''));
            let oscaroData =(await api.get(process.env.REACT_APP_OSCARO_API_URL_4 + result["vehicle-identity"]))["vehicle-info"] || {};

            let tecdocData = (await api.tecdoc.getVehiclesByKeyVin(oscaroData?.vin || ""))[0] || {};

            result = await api.tecdoc.getVehicleByIds4(tecdocData.carId);

            vehicule.carName = tecdocData.carName;
            vehicule.carId = tecdocData.carId;
            vehicule.manuId = tecdocData.manuId;
            vehicule.modelId = tecdocData.modelId;
            vehicule.vehicleDetails = {
                ...result.vehicleDetails,
                engineCode : oscaroData['engine-code'],
                gearboxCode : oscaroData['gearbox-code']
            }

            if (vehicule.carName?.length > 0 && vehicule.carId != 0 && vehicule.modelId != 0 && vehicule.manuId != 0 ) {
                vehicule = {
                    ...vehicule,
                    deleted: 0,
                    plate
                };

                vehicules.push({
                    ...vehicule
                });
            }

        } else {
            vehicule.deleted = 0;
        }

        return {
            vehicules: vehicules,
            vehicule: { ...vehicule }
        };

    } catch (err) {
        throw { message: err.message || err };
    }
}

export default createAction(getAutoFromPlate);