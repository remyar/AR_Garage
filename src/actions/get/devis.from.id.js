import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function getDevisFromNumber(devis_id = "1", { extra, getState }) {
    try {

        let devi = ipcRenderer.sendSync("database.getDeviById" , devis_id);
        let client = ipcRenderer.sendSync("database.getClientById" , devi.client_id);

        devi.client = client;
        
        console.log(devi);
       /* const state = getState();
        let devis = state.devis;
        let devi = devis.filter((el) => el.devis_number == devis_number)[0];

        if ( devi.vehicule_plate != undefined){
            let vehicule = state.vehicules.filter((_el) => _el.plate == devi.vehicule_plate);
            devi.vehicule = {...vehicule[0]};
        }

        devi.products = devi.products.filter((el) => el != undefined);
*/
        return { devi: devi }
        
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getDevisFromNumber);