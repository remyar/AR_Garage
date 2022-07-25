import createAction from '../../middleware/actions';
import manufacturers from '../../data/tecdoc/manufacturers.json';

export async function getManufacturers({ extra, getState }) {

    try {
        return { manufacturers: manufacturers };
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getManufacturers);