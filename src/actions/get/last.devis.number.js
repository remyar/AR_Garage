import createAction from '../../middleware/actions';

export async function getLastDevisNumber({ extra, getState }) {

    const api = extra.api;

    try {
        let result = await api.get("/api/v1/devis/getLastNumber");
        return JSON.parse(result);
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getLastDevisNumber);