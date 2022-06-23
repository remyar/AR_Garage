import createAction from '../../middleware/actions';

export async function getAllVehicules({ extra, getState }) {
    try {
        const state = getState();
        return { vehicules : state.vehicules};
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getAllVehicules);