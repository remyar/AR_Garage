import createAction from '../../middleware/actions';

export async function setNewService(value = {}, { extra, getState }) {

    const api = extra.api;

    try {
        let state = getState();
        let services = state.services;
        services.push({...value , id : services.length})
        return { services : services};
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(setNewService);