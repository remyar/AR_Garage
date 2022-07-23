import createAction from '../../middleware/actions';

export async function getAllFactures({ extra, getState }) {
    try {
        const state = getState();
        let factures = state.factures;
        factures = factures.map((el) => {
            if ( el.vehicule_id != undefined && el?.vehicule?.vehicleDetails == undefined ){
                let vehicule = state.vehicules.filter((_el) => _el.carId == el.vehicule_id);
                el.vehicule = {...vehicule[0]};
            }
            return el;
        })


        return { factures : factures};
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getAllFactures);