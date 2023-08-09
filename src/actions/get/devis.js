import createAction from '../../middleware/actions';

export async function getDevis(id, { extra, getState }) {

    const database = extra.database;

    try {
        let data = await database.getDevisById(id);
        if (data.client == undefined) {
            let client = await database.getClientById(data.client_id || 0);
            data.client = { ...client };
        }
        if (data.vehicule == undefined) {
            let vehicule = await database.getVehiculeById(data.vehicule_id || 0);
            data.vehicule = { ...vehicule };
        }
        return {
            devis : { ...data }
        };
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getDevis);