import createAction from '../../middleware/actions';
import marques from '../../data/marque.json';

export async function getAllMarques({ extra, getState }) {
    try {
        return { marques : marques};
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getAllMarques);