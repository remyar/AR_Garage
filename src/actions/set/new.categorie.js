import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function setNewCategorie(value = {}, { extra, getState }) {

    try {
        let categorie = ipcRenderer.sendSync("database.saveCategorie", value);

        return { categorie: categorie };
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(setNewCategorie);