import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function getAdjustmentsSentences({ extra, getState }) {
    const database = extra.database;

    try {
        let adjustementsSentences = await ipcRenderer.invoke("technics.getAdjustementsSentences");
        return {
            adjustementsSentences: adjustementsSentences || []
        }

    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getAdjustmentsSentences);