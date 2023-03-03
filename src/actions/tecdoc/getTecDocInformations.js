import createAction from '../../middleware/actions';

export async function getTecDocInformations({ extra, getState }) {
    const api = extra.api;
    
    try {
        let result = await api.get("https://www.goodrace.fr/download/tecdoc_database.json");
        return { tecdoc_server : result }
    }
    catch (err) {
        throw { message: err.message || err };
    }
}


export default createAction(getTecDocInformations);
