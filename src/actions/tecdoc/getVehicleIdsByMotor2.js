import createAction from '../../middleware/actions';

export async function getVehicleIdsByMotor2(engineId, { extra, getState }) {
    const api = extra.api;
    try {
        let state = getState();

        let result = await api.tecdoc.getVehicleIdsByMotor2(engineId);
     
        return {
            vehiculeIds : result
        };

    } catch (err) {
        throw { message: err.message || err };
    }
}

export default createAction(getVehicleIdsByMotor2);