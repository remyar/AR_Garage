import createAction from '../../middleware/actions';
import actions from '../../actions';

export async function getAllVehicules({ dispatch, extra, getState }) {
    const database = extra.database;

    try {
        let vehicules = await database.getAllVehicules();
        for (let vehicule of vehicules) {
            vehicule.hasTechnics = false;
            if (vehicule.image == undefined) {
                if (vehicule.tecdocId != undefined) {
                    try {
                        let data = await dispatch(actions.technics.getModelByTecdocId(vehicule.tecdocId));
                        let model = data?.model || {};
                        if (model.imageId) {
                            let image = await dispatch(actions.get.images(model.imageId));
                            vehicule.image = { ...image.image }
                        }
                    } catch (err) {
                    
                    } finally{
                        await database.saveVehicule(vehicule);
                    }
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