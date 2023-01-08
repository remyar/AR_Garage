import createAction from '../../middleware/actions';

export async function getMotorIdsByManuIdCriteria2 (engineCode , manuid, { extra, getState }) {
    const api = extra.api;
    try {
        let state = getState();

        let result = await api.tecdoc.getMotorIdsByManuIdCriteria2(engineCode , manuid);
     
        return {
            motorId : result.motorId
        };

    } catch (err) {
        throw { message: err.message || err };
    }
}

export default createAction(getMotorIdsByManuIdCriteria2);