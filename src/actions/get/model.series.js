import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';


export async function getModelSeries(id, { extra, getState }) {
    const api = extra.api;

    try {
        let modelSeries = ipcRenderer.sendSync("database.getModelSeries", id);

        return {
            modelSeries: modelSeries || []
        }

    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getModelSeries);