import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function getAutoFromPlate(plate = "AA-456-BB", { extra, getState }) {
    const api = extra.api;
    try {

        let vehicule = ipcRenderer.sendSync("database.getVehiculeFromPlate", plate);

        if (vehicule == undefined) {
            await api.get(process.env.REACT_APP_OSCARO_API_URL_1);
            await api.get(process.env.REACT_APP_OSCARO_API_URL_2);
            let result = await api.get(process.env.REACT_APP_OSCARO_API_URL_3 + plate.replace('-', '').replace('-', ''));
            let oscaroData = (await api.get(process.env.REACT_APP_OSCARO_API_URL_4 + result["vehicle-identity"]))["vehicle-info"] || {};
            let detail = result?.vehicles[0];

            let phase = detail.labels["complement-label"].fr.replace(detail.labels["full-label-fragment"].fr, "").trim();

            let puissance = parseInt((detail.labels["full-label-fragment"].fr.split(' ')[detail.labels["full-label-fragment"].fr.split(' ').length - 1]).replace("cv", ""));
            if (isNaN(puissance)) {
                puissance = parseInt((detail.labels["full-label-fragment"].fr.split(' ')[detail.labels["full-label-fragment"].fr.split(' ').length - 2]).replace("cv", ""));
            }

            vehicule = {
                oscaroId: parseInt(detail.id),
                brand: detail.labels["core-label"].fr.split(" ")[0],
                model: detail.labels["core-label"].fr.split(" ")[1],
                puissance: puissance,
                phase: phase,
                designation: detail.labels["full-label"].fr,
                engineCode: oscaroData["engine-code"],
                gearboxCode: oscaroData["gearbox-code"],
                immatriculationDate: oscaroData["immatriculation-date"],
                vin: oscaroData["vin"],
                energy: detail.energy.label.fr,
                deleted: 0,
                plate: plate,
                // tecdoc: { ...tecdoc }
            };

            vehicule = ipcRenderer.sendSync("database.saveVehicule", vehicule);
        }
        /*
                let state = getState();
                let vehicules = state.vehicules;
        
                let vehicule = vehicules.find((el) => {
                    if (el && el.plate) {
                        if (el.plate == plate) {
                            return true;
                        }
                    }
                    return false;
                });
        
                if (!vehicule) {
        
                    await api.get(process.env.REACT_APP_OSCARO_API_URL_1);
                    await api.get(process.env.REACT_APP_OSCARO_API_URL_2);
                    let result = await api.get(process.env.REACT_APP_OSCARO_API_URL_3 + plate.replace('-', '').replace('-', ''));
                    let oscaroData = (await api.get(process.env.REACT_APP_OSCARO_API_URL_4 + result["vehicle-identity"]))["vehicle-info"] || {};
                    let detail = result?.vehicles[0];
        
                    let phase = detail.labels["complement-label"].fr.replace(detail.labels["full-label-fragment"].fr, "").trim();
        
                    let puissance = parseInt((detail.labels["full-label-fragment"].fr.split(' ')[detail.labels["full-label-fragment"].fr.split(' ').length - 1]).replace("cv", ""));
                    if (isNaN(puissance)) {
                        puissance = parseInt((detail.labels["full-label-fragment"].fr.split(' ')[detail.labels["full-label-fragment"].fr.split(' ').length - 2]).replace("cv", ""));
                    }
        
                    vehicule = {
                        oscaroId: parseInt(detail.id),
                        brand: detail.labels["core-label"].fr.split(" ")[0],
                        model: detail.labels["core-label"].fr.split(" ")[1],
                        puissance: puissance,
                        phase: phase,
                        designation: detail.labels["full-label"].fr,
                        engineCode: oscaroData["engine-code"],
                        gearboxCode: oscaroData["gearbox-code"],
                        immatriculationDate: oscaroData["immatriculation-date"],
                        vin: oscaroData["vin"],
                        energy: detail.energy.label.fr,
                        deleted: 0,
                        plate: plate,
                        // tecdoc: { ...tecdoc }
                    };
        
                    vehicules.push({
                        ...vehicule
                    });
        
                } else {
                    vehicule.deleted = 0;
                }
        */
        return {
            //      vehicules: vehicules,
            vehicule: { ...vehicule }
        };

    } catch (err) {
        throw { message: err.message || err };
    }
}

export default createAction(getAutoFromPlate);