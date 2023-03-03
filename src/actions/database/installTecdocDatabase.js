import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function installTecdocDatabase(amBrands , { extra, getState }) {
    ipcRenderer.send("tecdoc.downloadDatabase" , amBrands);
    return;
}


export default createAction(installTecdocDatabase);
