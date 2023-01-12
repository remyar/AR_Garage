import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function getDevisFromId(devis_id = "1", { extra, getState }) {
    try {

        let devi = ipcRenderer.sendSync("database.getDeviById", devis_id);
        let client = ipcRenderer.sendSync("database.getClientById", devi.client_id);
        let vehicule = ipcRenderer.sendSync("database.getVehiculeById", devi.vehicule_id);

        devi.client = client;
        devi.vehicule = vehicule;
        devi.products = [];

        let _productsDevi = ipcRenderer.sendSync("database.getDeviProduitsByDeviId", devis_id);

        _productsDevi?.forEach((element) => {
            let _produit = ipcRenderer.sendSync("database.getProductById", element.produit_id);
            devi.products.push({ ..._produit, quantite: element.quantite, isService: false });
        });

        let _servicesDevi = ipcRenderer.sendSync("database.getDeviServicesByDeviId", devis_id);

        _servicesDevi?.forEach((element) => {
            let _service = ipcRenderer.sendSync("database.getServiceById", element.service_id);
            devi.products.push({ ..._service, quantite: element.quantite, prix_vente: element.prix_vente, isService: true });
        });

        return { devi: devi }

    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getDevisFromId);