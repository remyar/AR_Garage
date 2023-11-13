import createAction from '../../middleware/actions';
import technics from '../technics';

export async function getAllVehicules({ dispatch , extra, getState }) {
    const database = extra.database;

    try {
        let vehicules = await database.getAllVehicules();
        for (let vehicule of vehicules) {
            vehicule.hasTechnics = false;
            if (vehicule.tecdocId != undefined) {
                try{
                    let result = await dispatch(technics.getTechnicsEntry(vehicule.tecdocId));
                    if (result.technicsEntry.length > 0 ){
                        vehicule.hasTechnics = true;
                    }
                } catch(err){
                    vehicule.hasTechnics = false;
                }
            }
        }
        return {
            vehicules: vehicules
        }

    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getAllVehicules);