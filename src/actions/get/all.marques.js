import createAction from '../../middleware/actions';

export async function getAllMarques({ extra, getState }) {
    try {
        const state = getState();
        let marques = state.marques;
        return { marques : marques};
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getAllMarques);