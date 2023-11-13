import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

import getMotorByModelId from './get.motor.by.model.id';

export async function getModelSeries(id, { dispatch , extra, getState }) {
    const api = extra.api;

    try {
        let modelSeries = await ipcRenderer.invoke("technics.getModelSeries", id);
/*
        for ( let model of modelSeries){
            model.engine = await dispatch(getMotorByModelId())
        }*/
        return {
            modelSeries: modelSeries || []
        }

    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getModelSeries);

