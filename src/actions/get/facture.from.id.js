import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function factureFromId(facture_number = "1", { extra, getState }) {

    try {

        let facture = ipcRenderer.sendSync("database.getFactureById", facture_number);
        let client = ipcRenderer.sendSync("database.getClientById", facture.client_id);
        let vehicule = ipcRenderer.sendSync("database.getVehiculeById", facture.vehicule_id);

        facture.client = client;
        facture.vehicule = vehicule;
        facture.products = [];

        let _productsFacture = ipcRenderer.sendSync("database.getFactureProduitsByDeviId", facture_number);

        _productsFacture?.forEach((element) => {
            let _produit = ipcRenderer.sendSync("database.getProductById", element.produit_id);
            facture.products.push({ ..._produit, quantite: element.quantite, isService: false });
        });

        let _servicesFacture = ipcRenderer.sendSync("database.getFactureServicesByDeviId", facture_number);

        _servicesFacture?.forEach((element) => {
            let _service = ipcRenderer.sendSync("database.getServiceById", element.service_id);
            facture.products.push({ ..._service, quantite: element.quantite, prix_vente: element.prix_vente, isService: true });
        });

        return { facture:  facture}
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(factureFromId);