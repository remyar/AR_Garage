import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function devisToBilling(devis = {}, { extra, getState }) {
    try {
        let facture = ipcRenderer.sendSync("database.getAllServices");

        /*
        const state = getState();
        let factures = state.factures;

        let calcFactureNumber = 0;
        factures.forEach(element => {
            if (element.devis_number > calcFactureNumber) {
                calcFactureNumber = element.facture_number;
            }
        });

        factures.push({
            ...devis,
            id: factures.length,
            facture_number: calcFactureNumber + 1,
            date: new Date().getTime()
        });
*/
        return { facture : facture };
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(devisToBilling);