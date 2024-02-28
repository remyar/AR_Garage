import createAction from '../../middleware/actions';
import actions from '../../actions';

export async function getAllVehicules({ dispatch , extra, getState }) {
    const database = extra.database;

    try {
        let vehicules = await database.getAllVehicules();
        for (let vehicule of vehicules) {
            vehicule.hasTechnics = false;
        }
        return {
            vehicules: vehicules
        }

    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getAllVehicules);