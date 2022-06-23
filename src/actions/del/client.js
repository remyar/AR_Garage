import createAction from '../../middleware/actions';

export async function deleteClient(id, { extra, getState }) {

    try {
        let state = getState();
        state.clients.forEach((el,idx) => {
            if ( el.id == id){
                state.clients[idx].deleted = 1;
            }
        });
        return { clients : state.clients}
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(deleteClient);