import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function getAllMarques({ extra, getState }) {
    try {
        let marques = ipcRenderer.sendSync("tecdoc.getAmBrands");
        let usermarques = ipcRenderer.sendSync("database.getAllMarques");
        usermarques.forEach(element => {
            marques.data.array.push({ brandName : element.nom});
        });

        console.log(usermarques);
        return { marques : marques};
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getAllMarques);