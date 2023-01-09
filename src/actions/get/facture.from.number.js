import createAction from '../../middleware/actions';

export async function getFactureFromNumber(facture_number = "1", { extra, getState }) {

    try {
        const state = getState();
        let factures = state.factures;
        let facture = factures.filter((el) => el.facture_number == facture_number)[0];

        if ( facture.vehicule_plate != undefined){
            let vehicule = state.vehicules.filter((_el) => _el.plate == facture.vehicule_plate);
            facture.vehicule = {...vehicule[0]};
        }

        return { facture:  facture}
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getFactureFromNumber);