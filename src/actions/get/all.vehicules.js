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
                    let result = await api.tecdoc.getVehiclesByKeyNumberPlates(state.vehicules[i].plate);
                    state.vehicules[i] = {
                        ...result[0],
                        deleted: 0,
                        plate: state.vehicules[i].plate
                    };

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