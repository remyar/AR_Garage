import createAction from '../../middleware/actions';

export async function getAllFactures({ extra, getState }) {
    try {
        const state = getState();
        return { factures : state.factures};
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getAllFactures);