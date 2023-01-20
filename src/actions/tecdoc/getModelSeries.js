import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function getModelSeries(manuId , { extra, getState }) {

    try {

        let modelSeries = ipcRenderer.sendSync("tecdoc.getModelSeries", manuId);

        return { modelSeries : modelSeries };
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getModelSeries);