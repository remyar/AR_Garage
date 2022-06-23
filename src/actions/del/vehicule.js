import createAction from '../../middleware/actions';

export async function deleteVehicule(id, { extra, getState }) {
    try {
        let state = getState();
        state.vehicules.forEach((el, idx) => {
            if (el.id == id) {
                state.vehicules[idx].deleted = 1;
            }
        });
        return { vehicules: state.vehicules }
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(deleteVehicule);