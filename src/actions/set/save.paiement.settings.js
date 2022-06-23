import createAction from '../../middleware/actions';

export async function savePaiementSettings(value = {}, { extra, getState }) {
    try {
        const state = getState();
        let settings = state.settings;
        settings.paiement = {...value};
        return { settings : settings }
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(savePaiementSettings);