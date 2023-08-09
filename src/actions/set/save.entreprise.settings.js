import createAction from '../../middleware/actions';

export async function saveEntrepriseSettings(value = {}, { extra, getState }) {

    const database = extra.database;
    const api = extra.api;

    let settings = getState().settings || {};

    settings = { ...settings };
    settings.entreprise = { ...settings.entreprise, ...value };

    try {
        
        let result = await database.saveSettings(settings);

        return { settings: { ...settings, ...result } };
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(saveEntrepriseSettings);