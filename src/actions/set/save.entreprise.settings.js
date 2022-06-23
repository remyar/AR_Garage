import createAction from '../../middleware/actions';

export async function saveEntrepriseSettings(value = {}, { extra, getState }) {
    try {
        const state = getState();
        let settings = state.settings;
        settings.entreprise = {...value};
        return { settings : settings }
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(saveEntrepriseSettings);