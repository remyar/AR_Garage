import createAction from '../../middleware/actions';

export async function getAllVehicules({ extra, getState }) {
    const database = extra.database;

    try {
        let vehicules = await database.getAllVehicules();
        
        return {
            vehicules : vehicules
        }

    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getAllVehicules);