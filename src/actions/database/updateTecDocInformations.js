import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function updateTecDocInformations(data, installed, { extra, getState }) {
    try {
        ipcRenderer.sendSync("database.updateTecDocInformations", { ambrands: [data], installed: installed });

        let result = ipcRenderer.sendSync("database.getTecDocInformations");

        return { tecdoc: result }
    }
    catch (err) {
        throw { message: err.message || err };
    }
}


export default createAction(updateTecDocInformations);
