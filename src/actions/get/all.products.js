import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function getAllProducts({ extra, getState }) {
    try {
        let _products = [];
        let products = ipcRenderer.sendSync("database.getAllProducts");
        products.forEach((product)=>{
            if ( _products.find((f) => f.ref_fab == product.ref_fab) ){

            } else {
                _products.push(product);
            }
        })
        return { products : _products};
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getAllProducts);