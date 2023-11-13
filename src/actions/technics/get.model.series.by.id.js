import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function getModelSeriesById(id, { extra, getState }) {
    const database = extra.database;

    try {
        let modelSeries = await ipcRenderer.invoke("technics.getModelSeriesById", id);
        return {
            modelSeries: modelSeries[0] || undefined
        }

    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getModelSeriesById);