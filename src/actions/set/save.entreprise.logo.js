import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function saveEntrepriseLogo(value = "", { extra, getState }) {
    try {
        let settings = getState().settings;

        let logo = ipcRenderer.sendSync("database.saveLogoSettings", value);

        settings.logo = logo;

        return { settings : settings }
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(saveEntrepriseLogo);