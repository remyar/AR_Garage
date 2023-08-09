import createAction from '../../middleware/actions';


export async function getModelSeries(id, { extra, getState }) {
    const api = extra.api;

    try {
        let modelSeries = await api.get("/data/ModelSeries/" + id + ".json");

        return {
            modelSeries: modelSeries?.data?.array || []
        }

    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getModelSeries);