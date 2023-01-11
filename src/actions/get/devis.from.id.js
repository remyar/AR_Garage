import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function getDevisFromId(devis_id = "1", { extra, getState }) {
    try {

        let devi = ipcRenderer.sendSync("database.getDeviById" , devis_id);
        let client = ipcRenderer.sendSync("database.getClientById" , devi.client_id);
        let vehicule = ipcRenderer.sendSync("database.getVehiculeById" , devi.vehicule_id);
        
        devi.client = client;
        devi.vehicule = vehicule;
        devi.products = [];

        let _productsDevi = ipcRenderer.sendSync("database.getDeviProduitsByDeviId" , devis_id);

        _productsDevi?.forEach((element) => {
            let _produit = ipcRenderer.sendSync("database.getProductById" , element.produit_id);
            devi.products.push({..._produit , quantite : element.quantite});
        });

        return { devi: devi }
        
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getDevisFromId);