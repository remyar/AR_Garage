import createAction from '../../middleware/actions';

export async function getSettings({ extra, getState }) {
    try {
        const state = getState();
        let settings = state.settings;

        return { settings: settings }

    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getSettings);