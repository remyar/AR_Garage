import createAction from '../../middleware/actions';


export async function getAllDevis({ extra, getState }) {
    const database = extra.database;

    try {
        let devis = await database.getAllDevis();
        devis = await Promise.all(devis.map(async (devi) => {
            let obj = {...devi};
            if ( devi.client == undefined ){
                let client = await database.getClientById(devi.client_id || 0);
                obj.client = {...client};
            }
            if ( devi.vehicule == undefined ){
                let vehicule = await database.getVehiculeById(devi.vehicule_id || 0);
                obj.vehicule = {...vehicule};
            }
            let total = 0;
            devi.products.forEach(element => {
                total += (parseFloat(element.quantity) * parseFloat(element.taux));
            });
            return {...obj , total : total };
        }));
        return {
            devis: devis
        }

    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getAllDevis);