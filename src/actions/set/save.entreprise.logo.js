import createAction from '../../middleware/actions';

export async function saveEntrepriseLogo(value = "", { extra, getState }) {
    try {
        const state = getState();
        let settings = state.settings;
        settings.logo = value;
        return { settings : settings }
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(saveEntrepriseLogo);