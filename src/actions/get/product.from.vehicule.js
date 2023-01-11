import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function getProductsFromVehicule(vehicule, { extra, getState }) {

    const api = extra.api;

    try {
        let products = ipcRenderer.sendSync("database.getAllProducts");
        return { productsFromVehicule: products };
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getProductsFromVehicule);