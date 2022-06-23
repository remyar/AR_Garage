import createAction from '../../middleware/actions';

export async function getProductsFromVehicule(vehicule, { extra, getState }) {

    const api = extra.api;

    try {
        let _oems = await api.get("/api/v1/oems/byVehiculeId/" + vehicule.id);
        let _products = await api.get("/api/v1/products");
        let products = JSON.parse(_products);
        let oems = JSON.parse(_oems);

        let v_products = [];
        
        oems.forEach((oem) => {
            products.forEach((product) => {
                if ( product.ref_oem == oem.ref_oem ){
                    v_products.push(product);
                }
            })
        });
        return { products : v_products};
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getProductsFromVehicule);