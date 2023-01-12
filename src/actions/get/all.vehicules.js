import createAction from '../../middleware/actions';
import technics from '../../data/technics.json';
import { ipcRenderer } from 'electron';

export async function getAllVehicules({ extra, getState }) {
    try {
        let vehicules = ipcRenderer.sendSync("database.getAllVehicules");
    
        return { vehicules: vehicules };
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getAllVehicules);