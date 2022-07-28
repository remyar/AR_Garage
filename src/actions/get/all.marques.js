import createAction from '../../middleware/actions';
import amBrands from '../../data/tecdoc/amBrands.json';

export async function getAllMarques({ extra, getState }) {
    try {
        return { marques : amBrands};
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getAllMarques);