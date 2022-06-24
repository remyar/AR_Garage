import createAction from '../../middleware/actions';

export async function devisToBilling(devis = {}, { extra, getState }) {
    try {
        const state = getState();
        let factures = state.factures;

        let calcFactureNumber = 0;
        factures.forEach(element => {
            if (element.devis_number > calcFactureNumber) {
                calcFactureNumber = element.facture_number;
            }
        });

        factures.push({
            ...devis,
            id: factures.length,
            facture_number: calcFactureNumber + 1,
            date: new Date().getTime()
        });

        return { factures: factures };
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(devisToBilling);