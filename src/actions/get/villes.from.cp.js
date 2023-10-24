import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function getVillesFromCp(codePostale = "24660", { extra, getState }) {
    try {

        let cp = await ipcRenderer.invoke("code_postaux.getAllCodePostaux");

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