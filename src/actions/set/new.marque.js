import createAction from '../../middleware/actions';

export async function setNewMarque(value = {}, { extra, getState }) {

    const api = extra.api;

    try {
        let result = await api.post('/api/v1/marque', value, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return { marques: {} };
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(setNewMarque);