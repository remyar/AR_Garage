import createAction from '../../middleware/actions';

export async function getAllDevis({ extra, getState }) {
    try {
        const state = getState();
        let devis = state.devis;
        devis = devis.map((el) => {
            if ( el.client_id != undefined){
                let client = state.clients.filter((_el) => _el.id == el.client_id);
                el.client = {...client[0]};
            }
            if ( el.vehicule_id != undefined){
                let vehicule = state.vehicules.filter((_el) => _el.carId == el.vehicule_id);
                el.vehicule = {...vehicule[0]};
            }
            return el;
        })
        return { devis : devis};
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getAllDevis);