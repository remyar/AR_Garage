import createAction from '../../middleware/actions';

export async function saveService(value = {}, { extra, getState }) {
    const database = extra.database;
    const api = extra.api;
    const settings = getState().settings;

    try {

        await database.saveService(value);
        return {
            service: value
        };
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(saveService);