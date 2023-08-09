import createAction from '../../middleware/actions';

export async function getAllFactures({ extra, getState }) {
    const database = extra.database;

    try {
        let factures = await database.getAllFactures();
        factures = await Promise.all(factures.map(async (facture) => {
            let obj = {...facture};
            let total = 0;
            facture.products.forEach(element => {
                total += (parseFloat(element.quantity) * parseFloat(element.taux));
            });
            return {...obj , total : total };
        }));
        return {
            factures: factures
        }
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getAllFactures);