import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function saveFacture(value = {}, { extra, getState }) {
    try {

        let totalFacture = 0;
        value.products.forEach(async (element) => {
            totalFacture += element.prix_vente * element.quantite;
        });

        let _facture = { ...value , total : totalFacture};
        delete _facture.id;

        let facture = ipcRenderer.sendSync("database.saveFacture", _facture);

        let services = value.products.map((el) => { if (el.isService == true) return el }).filter((el) => el != undefined);
        let products = value.products.map((el) => { if (el.isService == undefined || el.isService == false) return el }).filter((el) => el != undefined);

        products.forEach(async (element) => {
            let _product = {
                factures_id: facture.id,
                produit_id: element.id,
                quantite: element.quantite
            }
            let temp = await ipcRenderer.sendSync("database.saveFacturesProduct", _product)
        });

        services.forEach(async (element) => {
            let _service = {
                factures_id: facture.id,
                service_id: element.id,
                quantite: element.quantite,
                prix_vente: element.prix_vente
            }
            let temp = await ipcRenderer.sendSync("database.saveFacturesService", _service)
        });

        return { facture: facture }

    } catch (err) {

    }
}

export default createAction(saveFacture);