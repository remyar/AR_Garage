import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function getAllFactures({ extra, getState }) {
    try {

        let factures = ipcRenderer.sendSync("database.getAllFactures");
        factures?.forEach(element => {
            element.client = ipcRenderer.sendSync("database.getClientById", element.client_id);
            element.vehicule = ipcRenderer.sendSync("database.getVehiculeById", element.vehicule_id);

            element.products = [];

            let _productsFacture = ipcRenderer.sendSync("database.getFactureProduitsByDeviId", element.id);
    
            _productsFacture?.forEach((_element) => {
                let _produit = ipcRenderer.sendSync("database.getProductById", _element.produit_id);
                element.products.push({ ..._produit, quantite: _element.quantite, isService: false });
            });
    
            let _servicesFacture = ipcRenderer.sendSync("database.getFactureServicesByDeviId", element.id);
    
            _servicesFacture?.forEach((_element) => {
                let _service = ipcRenderer.sendSync("database.getServiceById", _element.service_id);
                element.products.push({ ..._service, quantite: _element.quantite, prix_vente: _element.prix_vente, isService: true });
            });
            
        });
        
        return { factures: factures };
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getAllFactures);