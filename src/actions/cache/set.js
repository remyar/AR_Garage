import createAction from '../../middleware/actions';


export async function set(url , { extra, getState }) {
    const api = extra.api;

    try {
        let result = await api.get(url, { cache: "no-cache" });
        return {}
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(set);