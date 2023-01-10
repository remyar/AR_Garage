import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function saveDevis(value = {}, { extra, getState }) {
    try {

        let devis = ipcRenderer.sendSync("database.saveDevi", value);
        /*
        const state = getState();
        let devis = state.devis;

        let calcDevisNumber = 0;
        devis.forEach(element => {
            if ( element.devis_number > calcDevisNumber){
                calcDevisNumber = element.devis_number;
            }
        });

        devis.push({ 
            ...value, 
            id: devis.length,
            devis_number : calcDevisNumber+1
        });*/
        return { devis: devis }
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(saveDevis);