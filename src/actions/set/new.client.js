import createAction from '../../middleware/actions';

export async function setNewCLient(client = {}, { extra, getState }) {

    try {
        let state = getState();
        state.clients.push({...client , id : state.clients.length});

        return { 
            clients : state.clients ,
            selectedVehicule: {} 
        };
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(setNewCLient);