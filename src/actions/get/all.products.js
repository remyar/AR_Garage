import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function getAllProducts({ extra, getState }) {
    try {
        let deletedRefFab = [];
        let _products = [];
        let products = ipcRenderer.sendSync("database.getAllProducts");
        products.forEach((product) => {
            if (_products.find((f) => f.ref_fab == product.ref_fab) == undefined) {
                let deleted = ipcRenderer.sendSync("database.getProduitDeletedByProduitId", product.id);
                if (deleted.deleted == false) {
                    if (deletedRefFab.find((el) => product.ref_fab == el) == undefined) {
                        _products.push(product);
                    }
                } else {
                    deletedRefFab.push(product.ref_fab);
                }
            }
        })

        return { products: _products };
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getAllProducts);