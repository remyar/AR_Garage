import createAction from '../../middleware/actions';

export async function saveEntrepriseLogo(value = {}, { extra, getState }) {

    const database = extra.database;
    const api = extra.api;

    let settings = getState().settings || {};
    settings = { ...settings };
    settings.logo = value ;
    try {

        let result = await database.saveSettings(settings);

        return { settings: { ...settings, ...result } };
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(saveEntrepriseLogo);