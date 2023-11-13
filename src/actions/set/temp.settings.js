import createAction from '../../middleware/actions';

export async function tempSettings(value = {}, { extra, getState }) {

    let settings = getState().settings || {};

    settings = { ...settings };
    settings.tempSettings = { ...settings.tempSettings, ...value };
    
    try {
        return { settings: settings };
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(tempSettings);