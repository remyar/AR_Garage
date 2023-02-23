import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function getProductsFromVehicule(vehicule, { extra, getState }) {

    const api = extra.api;

    try {
        let _products = [];
        let products = ipcRenderer.sendSync("database.getAllProducts");
        if (vehicule && vehicule.id != undefined) {
            let __products = [];

            __products = products.filter((p) => p.ref_oem == undefined || p.ref_oem == '');

            let oems = ipcRenderer.sendSync("database.getOemByCarId", vehicule.id);
            oems.forEach((oem) => {
                if ( products.find((p)=> p.ref_oem == oem.ref_oem) ){
                    __products.push(products.find((p)=> p.ref_oem == oem.ref_oem));
                }
            });

            products = [...__products];

        }
        products.forEach((product) => {
            if (_products.find((f) => f.ref_fab == product.ref_fab)) {

            } else {
                _products.push(product);
            }
        })
        return { productsFromVehicule: _products };
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getProductsFromVehicule);