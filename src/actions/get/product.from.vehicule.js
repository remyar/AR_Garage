import createAction from '../../middleware/actions';

export async function getProductsFromVehicule(vehicule, { extra, getState }) {

    const api = extra.api;

    try {

        let products = getState()?.products;
        let oems = getState()?.oem.filter((f) => f.carId == vehicule.carId);

        let v_products = [];
        
        oems.forEach((oem) => {
            products.forEach((product) => {
                if ( product.ref_oem == oem.oem ){
                    if ( !v_products.find((v) => ((v.brand == product.brand) && (v.ref_fab == product.ref_fab))) ) {
                        v_products.push(product);
                    }
                }
            })
        });
        return { productsFromVehicule : v_products};
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getProductsFromVehicule);