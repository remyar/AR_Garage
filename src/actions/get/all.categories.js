import createAction from '../../middleware/actions';

import { ipcRenderer } from 'electron';

export async function getAllCategories({ extra, getState }) {
    try {
        let categories = ipcRenderer.sendSync("database.getAllCategories");

        return { categories : categories};
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getAllCategories);