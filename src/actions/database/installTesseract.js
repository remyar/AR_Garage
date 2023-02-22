import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';
import fs from 'fs';

export async function installTesseract({ extra, getState }) {
    ipcRenderer.send("tecdoc.downloadTesseract");
    return;
}


export default createAction(installTesseract);
