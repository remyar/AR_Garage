import createAction from '../../middleware/actions';
import technics from '../../data/technics.json';

export async function getAllVehicules({ extra, getState }) {
    try {
        const api = extra.api;
        const state = getState();

        //-- check and upgrade old vehicule with tecdoc model
        for (let i = 0; i < state.vehicules?.length || 0; i++) {
            if (state.vehicules[i].oscaroId == undefined) {

                //-- old model
                try {

                    await api.get(process.env.REACT_APP_OSCARO_API_URL_1);
                    await api.get(process.env.REACT_APP_OSCARO_API_URL_2);
                    let result = await api.get(process.env.REACT_APP_OSCARO_API_URL_3 + state.vehicules[i].plate.replace('-', '').replace('-', ''));
                    let oscaroData = (await api.get(process.env.REACT_APP_OSCARO_API_URL_4 + result["vehicle-identity"]))["vehicle-info"] || {};
                    let detail = result?.vehicles[0];


                    let phase = detail.labels["complement-label"].fr.replace(detail.labels["full-label-fragment"].fr, "").trim();
                    let puissance = detail.labels["full-label-fragment"].fr.split(' ')[detail.labels["full-label-fragment"].fr.split(' ').length - 2] + " cv";
                    state.vehicules[i] = {
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
                        plate: state.vehicules[i].plate
                    };

                } catch (err) {
                    throw { message: err.message };
                }
            }
        }

        if ((state.vehicules?.length || 0) > 0) {
            state.vehicules = state.vehicules.map((v) => {
                v.hasTechnics = false;
                try {
                    let brand = v.vehicleDetails.manuName.toUpperCase();
                    let engine_code = v.vehicleDetails.engineCode.toUpperCase();

                    let _technics = technics[brand];
                    if (_technics == undefined) {
                        _technics = {};
                    }

                    if (_technics[engine_code] != undefined) {
                        v.hasTechnics = true;
                    }
                } catch (err) {
                    //-- aucune infos
                }
                return v;
            });
        } else {
            state.vehicules = [];
        }


        return { vehicules: state.vehicules };
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getAllVehicules);