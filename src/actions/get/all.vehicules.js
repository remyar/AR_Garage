import createAction from '../../middleware/actions';
import technics from '../../data/technics.json';

export async function getAllVehicules({ extra, getState }) {
    try {
        const state = getState();

        state.vehicules = state.vehicules.map((v) => {
            v.hasTechnics = false;

            let brand = v.brand.toUpperCase();
            let engine_code = v.engine_code.toUpperCase();

            let _technics = technics[brand];
            if ( _technics == undefined ){
                _technics = {};
            }

            if ( _technics[engine_code] != undefined ){
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