import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function setNewVehicule(value = {}, { extra, getState }) {
    try {

        let vehicule = {
            oscaroId: undefined,
            tecdocId: value.tecdocId || undefined,
            brand: value.brand,
            model: value.model,
            puissance: value.puissance,
            phase: undefined,
            designation: value.designation,
            engineCode: value.engineCode,
            gearboxCode: undefined,
            immatriculationDate: undefined,
            vin: undefined,
            energy: value.energy,
            deleted: 0,
            plate: value.plate,
            // tecdoc: { ...tecdoc }
        };

        vehicule = ipcRenderer.sendSync("database.saveVehicule", vehicule);
        return { vehicule : vehicule};
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(setNewVehicule);