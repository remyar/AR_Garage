import createAction from '../../middleware/actions';
import cp from '../../data/laposte_hexasmal.json';

export async function getVillesFromCp(codePostale = "24660", { extra, getState }) {
    try {

        if ( codePostale.trim().length >= 2){

            let value = cp.map((el) => {
                if(el.fields.code_postal.startsWith(codePostale.trim())){
                    return { name : el.fields.nom_de_la_commune };
                }
            }).filter((el) => el != undefined);

            return { code_postaux : value};
        }
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getVillesFromCp);