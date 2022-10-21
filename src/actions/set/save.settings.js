import createAction from '../../middleware/actions';

export async function saveSettings(value = {}, { extra, getState }) {
    try {
        const state = getState();
        let settings = state.settings;
        settings = {...settings , ...value};
        return { settings : settings }
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(saveSettings);