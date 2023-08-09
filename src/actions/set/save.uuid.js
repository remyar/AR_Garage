import createAction from '../../middleware/actions';

export async function saveUuid(value = {}, { extra, getState }) {

    const database = extra.database;
    const api = extra.api;

    let settings = getState().settings || {};

    settings = { ...settings, ...value };

    try {

        let result = await database.saveSettings(settings);

        return {  };

    } catch (err) {

        throw { message: err.message };
    }
}

export default createAction(saveUuid);