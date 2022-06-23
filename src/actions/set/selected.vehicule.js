import createAction from '../../middleware/actions';

export async function setSelectedVehicule(vehicule = {} , { extra, getState }) {
    try {
        return { selectedVehicule : {...vehicule}};
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(setSelectedVehicule);