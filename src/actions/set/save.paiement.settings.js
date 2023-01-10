import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function savePaiementSettings(value = {}, { extra, getState }) {
    try {
        let settings = getState().settings;

        let paiement = ipcRenderer.sendSync("database.savePaiementSettings", value);

        settings.paiement = paiement;

        return { settings: settings }

    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(savePaiementSettings);