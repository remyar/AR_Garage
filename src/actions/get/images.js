import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';


export async function getImage(id, { extra, getState }) {
    try {
        let images = await ipcRenderer.invoke("images.getImage", id);

        let image = undefined;
        if (images.length > 0) {
            image = images[0];
        }

        return {
            image
        };
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getImage);