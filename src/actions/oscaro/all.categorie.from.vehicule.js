import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function getAllCategorieFromVehicule(vehicule, { extra, getState }) {
    const api = extra.api;
    try {
     /*   await api.get(process.env.REACT_APP_OSCARO_API_URL_1);
        let token = await api.get(process.env.REACT_APP_OSCARO_API_URL_2);
        /*let result = await api.get(process.env.REACT_APP_OSCARO_API_URL_3 + vehicule.plate.replace('-', '').replace('-', ''));
        let oscaroData = (await api.get(process.env.REACT_APP_OSCARO_API_URL_4 + result["vehicle-identity"]))|| {};

        let vehiculeIdentity = oscaroData;

        await api.post("https://www.oscaro.com/xhr/eiffel/fr/fr" , {'eiffel-canonical-keys': [ {"vid": vehicule.oscaroId }]},{ headers : {"content-type" : "application/json"}});
        */
        let categories = ipcRenderer.sendSync("database.getAllCategories");
        return { catalog : categories }
    } catch (err) {

    }
}

export default createAction(getAllCategorieFromVehicule);