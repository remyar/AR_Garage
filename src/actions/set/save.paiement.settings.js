import createAction from '../../middleware/actions';

export async function savePaiementSettings(value = {}, { extra, getState }) {
    const database = extra.database;
    const api = extra.api;

    let settings = getState().settings || {};
    settings = { ...settings };
    settings.paiement = { ...settings.paiement, ...value };
    try {

        let result = await database.saveSettings(settings);

        return { settings: { ...settings, ...result } };
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(savePaiementSettings);