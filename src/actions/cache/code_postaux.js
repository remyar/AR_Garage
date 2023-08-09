import createAction from '../../middleware/actions';


export async function getCodePostaux({ extra, getState }) {
    const api = extra.api;

    try {
        let result = await api.get("/code_postaux/laposte_hexasmal.json", { cache: "no-cache" });
        return {}
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getCodePostaux);