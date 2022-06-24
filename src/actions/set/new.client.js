import createAction from '../../middleware/actions';

export async function setNewCLient(client = {}, { extra, getState }) {

    try {
        let state = getState();

        let _c = {...client , id : state.clients.length};
        state.clients.push(_c);

        return { 
            clients : state.clients ,
            client : _c
        };
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(setNewCLient);