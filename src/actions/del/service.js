import createAction from '../../middleware/actions';

export async function deleteService(id, { extra, getState }) {
    try {
        let state = getState();
        state.services.forEach((el,idx) => {
            if ( el.id == id){
                state.services[idx].deleted = 1;
            }
        });
        return { services : state.services}
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(deleteService);