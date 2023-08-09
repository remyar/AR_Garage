import createAction from '../../middleware/actions';

export async function saveDevis(value = {}, { extra, getState }) {
    const database = extra.database;
    const api = extra.api;
    const settings = getState().settings;

    try {
        
        await database.saveDevis(value);

        return {
            devi: value
        };
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(saveDevis);