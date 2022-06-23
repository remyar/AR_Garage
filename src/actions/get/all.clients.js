import createAction from '../../middleware/actions';

export async function getAllClients({ extra, getState }) {
    try {
        const state = getState();
        return { clients : state.clients};
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getAllClients);