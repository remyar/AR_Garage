import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function getAllDevis({ extra, getState }) {
    try {
        let devis = ipcRenderer.sendSync("database.getAllDevis");
        devis?.forEach(element => {
            element.client = ipcRenderer.sendSync("database.getClientById", element.client_id) ;
            element.vehicule = ipcRenderer.sendSync("database.getVehiculeById", element.vehicule_id) ;
        });
        return { devis : devis};
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getAllDevis);