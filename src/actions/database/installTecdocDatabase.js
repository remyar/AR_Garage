import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function installTecdocDatabase({ extra, getState }) {
    ipcRenderer.send("tecdoc.downloadDatabase");
    return;
}


export default createAction(installTecdocDatabase);
