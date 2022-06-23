import createAction from '../../middleware/actions';
import categories from '../../data/categorie.json';

export async function getAllCategories({ extra, getState }) {
    try {
        return { categories : categories};
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getAllCategories);