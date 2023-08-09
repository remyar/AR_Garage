import createAction from '../../middleware/actions';

export async function getVillesFromCp(codePostale = "24660", { extra, getState }) {
    try {
        const api = extra.api;
        let cp = await api.get("/code_postaux/laposte_hexasmal.json");
        cp = cp.map((e) => e.fields);
        if ( codePostale.trim().length >= 2){
            let value = cp.map((el) => {
                if(el.code_postal.toString().startsWith(codePostale.trim())){
                    return el;
                }
            }).filter((el) => el != undefined);

            return { code_postaux : value};
        }
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getVillesFromCp);