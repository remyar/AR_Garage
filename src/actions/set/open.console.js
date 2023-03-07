import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function openConsole(value = false, { extra, getState }) {
    try {
        ipcRenderer.send("OPEN_DEV_TOOLS", value);
        return {};
    } catch (err) {
        throw { message: err.message };
    }

}

export default createAction(openConsole);