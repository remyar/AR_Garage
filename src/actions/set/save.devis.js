import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function saveDevis(value = {}, { extra, getState }) {
    try {

        let totalDevis = 0;
        value.products.forEach(async (element) => {
            totalDevis += element.prix_vente * element.quantity;
        });

        let devis = ipcRenderer.sendSync("database.saveDevi", { ...value , total : totalDevis});

        value.products.forEach(async (element) => {
            let _product = {
                devis_id : devis.id,
                produit_id : element.id,
                quantite : element.quantity
            }
            let temp = await ipcRenderer.sendSync("database.saveDevisProduct", _product);
        });

        return { devis: devis }
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(saveDevis);