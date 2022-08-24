import createAction from '../../middleware/actions';

export async function getAutoFromPlate(plate = "AA-456-BB", { extra, getState }) {
    const api = extra.api;
    try {
        let state = getState();
        let vehicules = state.vehicules;

        let vehicule = vehicules.find((el) => {
            if ( el && el.plate){
                if ( el.plate == plate ){
                    return true;
                }
            }
            return false;
        });

        if (!vehicule) {

            let result = await api.tecdoc.getVehiclesByKeyNumberPlates(plate);
        
            vehicule = {
                ...result[0] , 
                deleted : 0,
                plate  
            } ;
            vehicules.push({
                ...vehicule
            });

        } else {
            vehicule.deleted = 0;
        }

        return {
            vehicules: vehicules,
            vehicule: { ...vehicule }
        };

    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getAutoFromPlate);