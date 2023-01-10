import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function saveSettings(value = {}, { extra, getState }) {
    try {
        let settings = getState().settings;

        let setting = ipcRenderer.sendSync("database.saveGeneralSettings", value);

        return { settings : {...settings,...setting }};
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(saveSettings);