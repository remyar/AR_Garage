import createAction from '../../middleware/actions';

export async function getVehicleById(tecdocId, { extra, getState }) {
    const api = extra.api;
    try {
        let result = await api.tecdoc.getVehicleByIds4(tecdocId);
     
        return {
            vehiculeIds : result
        };

    } catch (err) {
        throw { message: err.message || err };
    }
}

export default createAction(getVehicleById);