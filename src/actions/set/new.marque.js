import createAction from '../../middleware/actions';

export async function setNewMarque(value = {}, { extra, getState }) {

    try {
        let state = getState();
        let marques = state.marques;
        marques.push({ ...value })
        return { marques: marques };
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(setNewMarque);