import createAction from '../../middleware/actions';

export async function getAllServices({ extra, getState }) {
    try {
        const state = getState();
        return { services : state.services};
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getAllServices);