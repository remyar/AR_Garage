import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function getAdjustmentByTypeId(id, { extra, getState }) {
    const database = extra.database;

    try {
        let adjustments = await ipcRenderer.invoke("technics.getAdjustmentByTypeId", id);
        return {
            adjustments: adjustments || []
        }

    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getAdjustmentByTypeId);