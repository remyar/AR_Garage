import createAction from '../../middleware/actions';

export async function getFactureFromNumber(facture_number = "1", { extra, getState }) {

    try {
        const state = getState();
        let factures = state.factures;
        return { facture: factures.filter((el) => el.facture_number == facture_number)[0] }
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getFactureFromNumber);