import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function getTechnicsEntry(tecdocId , { extra, getState }) {
    const database = extra.database;

    try {
        let technicsEntry = await ipcRenderer.invoke("technics.getTechnicsEntry", tecdocId);
        return {
            technicsEntry: technicsEntry
        }

    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getTechnicsEntry);