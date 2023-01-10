import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function getSettings({ extra, getState }) {
    try {
        let entreprise = ipcRenderer.sendSync("database.getEntrepriseSettings");
        let paiement = ipcRenderer.sendSync("database.getPaiementSettings");
        let logo = ipcRenderer.sendSync("database.getLogoSettings");
        let _settings = ipcRenderer.sendSync("database.getGeneralSettings");

        return {
            settings: {
                entreprise: entreprise,
                paiement : paiement,
                logo : logo.logo,
                ..._settings
            }
        }

    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getSettings);