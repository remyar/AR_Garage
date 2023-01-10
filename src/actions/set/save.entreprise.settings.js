import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function saveEntrepriseSettings(value = {}, { extra, getState }) {
    try {
        let settings = getState().settings;

        let entreprise = ipcRenderer.sendSync("database.saveEntrepriseSettings", value);

        settings.entreprise = entreprise;

        return { settings: settings }

    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(saveEntrepriseSettings);