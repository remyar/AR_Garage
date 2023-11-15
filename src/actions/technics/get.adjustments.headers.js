import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function getAdjustmentsHeaders({ extra, getState }) {
    const database = extra.database;

    try {
        let adjustementsHeaders = await ipcRenderer.invoke("technics.getAdjustementsHeaders");
        return {
            adjustementsHeaders: adjustementsHeaders || []
        }

    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getAdjustmentsHeaders);