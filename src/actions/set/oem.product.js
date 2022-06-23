import createAction from '../../middleware/actions';

export async function setOemReference(value = {}, { extra, getState }) {

    const api = extra.api;

    try {
        let result = await api.post('/api/v1/oem', value, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return { selectedProduct: {} };
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(setOemReference);