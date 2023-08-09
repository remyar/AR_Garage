import createAction from '../../middleware/actions';

export async function saveVehicule(value = {}, { extra, getState }) {
    const database = extra.database;
    const api = extra.api;
    const settings = getState().settings;

    try {

        await database.saveVehicule(value);

        return {
            vehicule: value
        };
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(saveVehicule);