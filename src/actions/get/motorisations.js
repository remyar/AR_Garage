import createAction from '../../middleware/actions';


export async function getMotorisations(manuId, modelId, { extra, getState }) {
    const api = extra.api;

    try {
        let motorisations = await api.get("/data/Vehicle/" + manuId + "/" + modelId + ".json");

        return {
            motorisation: motorisations?.data?.array || []
        }

    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getMotorisations);