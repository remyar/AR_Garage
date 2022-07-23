import createAction from '../../middleware/actions';
import technics from '../../data/technics.json';

export async function getAllTechnicsByBrandAndEngineCode(brand, engine_code, { extra, getState }) {

    brand = brand.toUpperCase();
    engine_code = engine_code.toUpperCase();
    try {
        const state = getState();
        let _technics = technics[brand];

        if ( _technics == undefined ){
            _technics = {};
        }

        return {
            technics: _technics[engine_code] || {}
        };

    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getAllTechnicsByBrandAndEngineCode);