import createAction from '../../middleware/actions';
import utils from '../../utils';

export async function saveDevis(value = {}, { extra, getState }) {
    const database = extra.database;
    const api = extra.api;
    const settings = getState().settings;

    try {
        value.id = utils.isNaNOrNullOrUndefined(value.id) ? undefined : parseInt(value.id);
        if ( value.id == undefined ){
            delete value.id;
        }
        await database.saveDevis(value);
        return {
            devi: value
        };
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(saveDevis);