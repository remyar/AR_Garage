import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function removeTecDocDatabase(data, { extra, getState }) {
    try {

        ipcRenderer.sendSync("tecdoc.removeTecDocDatabase", data.map((el) => el.ambrand));
        ipcRenderer.sendSync("database.removeTecDocDatabase", data.map((el) => el.id));
        
        let result = ipcRenderer.sendSync("database.getTecDocInformations");

        return { tecdoc: result }
    }
    catch (err) {
        throw { message: err.message || err };
    }
}


export default createAction(removeTecDocDatabase);