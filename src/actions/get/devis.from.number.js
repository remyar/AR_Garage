import createAction from '../../middleware/actions';

export async function getDevisFromNumber(devis_number = "1", { extra, getState }) {
    try {
        const state = getState();
        let devis = state.devis;
        let devi = devis.filter((el) => el.devis_number == devis_number)[0];

        devi.products = devi.products.map((el) => {
            if ( el?.service_id ){
                return state.services.filter((_el) => _el.id == el.service_id)[0];
            }
        });

        devi.products = devi.products.filter((el) => el != undefined);
        return { devi: devi }
        
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getDevisFromNumber);