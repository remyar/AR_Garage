import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function saveDevis(value = {}, { extra, getState }) {
    try {

        let totalDevis = 0;
        value.products.forEach(async (element) => {
            totalDevis += element.prix_vente * element.quantity;
        });

        let devis = ipcRenderer.sendSync("database.saveDevi", { ...value, total: totalDevis });

        let services = value.products.map((el) => { if (el.isService == true) return el }).filter((el) => el != undefined);
        let products = value.products.map((el) => { if (el.isService == undefined || el.isService == false) return el }).filter((el) => el != undefined);

        products.forEach(async (element) => {
            let _product = {
                devis_id: devis.id,
                produit_id: element.id,
                quantite: element.quantity
            }
            let temp = await ipcRenderer.sendSync("database.saveDevisProduct", _product)
        });

        services.forEach(async (element) => {
            let _service = {
                devis_id: devis.id,
                service_id: element.id,
                quantite: element.quantity,
                prix_vente: element.prix_vente
            }
            let temp = await ipcRenderer.sendSync("database.saveDevisService", _service)
        });

        return { devis: devis }
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(saveDevis);