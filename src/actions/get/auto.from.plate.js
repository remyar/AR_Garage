import createAction from '../../middleware/actions';


export async function getAutoFromPlate(plate = "BB-456-CC", { extra, getState }) {

    const api = extra.api;
    try {

        let state = getState();
        let vehicules = state.vehicules;

        let vehicule = vehicules.find((el) => el.plate == plate);
        
        if (!vehicule) {
            await api.post("https://www.opisto.fr/async/auto/refresh/search?ImmatOpisto=BB-456-CC");
            let result = await api.post("https://www.opisto.fr/partial/auto/identifiedvehicle");

            console.log(result);
        } else {
            vehicule.deleted = 0;
        }

        return {
            vehicules: vehicules,
            vehicule: { ...vehicule }
        };
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getAutoFromPlate);