import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function setOemReference(value = {}, { extra, getState }) {

    try {
        let oem = ipcRenderer.sendSync("database.saveOem", value);

        return { oem : oem};
    } catch (err) {
        throw { message: err.message };
    }
/*
    try {
        let state = getState();
        let oem = state.oem;

        if ( oem.find((el) => ((el.carId == value.carId) && (el.oem == value.oem))) == undefined ){
            oem.push(value);
        }

        return { oem: oem };
    } catch (err) {
        throw { message: err.message };
    }*/
}

export default createAction(setOemReference);