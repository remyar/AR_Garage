import createAction from '../../middleware/actions';

export async function editClient(client = {}, { extra, getState }) {

    try {
        let state = getState();
        state.clients.forEach((el,idx) => {
            if ( el.id == client.id){
                state.clients[idx] = {...client};
            }
        });
        return { clients : state.clients};
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(editClient);