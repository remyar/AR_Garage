import createAction from '../../middleware/actions';

export async function getFacture(id, { extra, getState }) {

    const database = extra.database;

    try {
        let data = await database.getFactureById(id);
        if (data.client == undefined) {
            let client = await database.getClientById(data.client_id || 0);
            data.client = { ...client };
        }
        if (data.vehicule == undefined) {
            let vehicule = await database.getVehiculeById(data.vehicule_id || 0);
            data.vehicule = { ...vehicule };
        }
        return {
            factures : { ...data }
        };
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getFacture);