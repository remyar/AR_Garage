import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function getTecDocInformations({ extra, getState }) {
    try {
        let result = ipcRenderer.sendSync("database.getTecDocInformations");

        //let result = await api.get("https://www.goodrace.fr/download/tecdoc_database.json");

        return { tecdoc: result }
    }
    catch (err) {
        throw { message: err.message || err };
    }
}


export default createAction(getTecDocInformations);
