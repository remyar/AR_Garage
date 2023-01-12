import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function restoreFromJSON(data , { extra, getState }) {

    if ( data.settings != undefined ){
        let settings = data.settings;
        if ( settings.entreprise != undefined ){
            let entreprise = settings.entreprise;
            let _entreprise = {
                nom : entreprise.nom,
                adresse1 : entreprise.adresse1,
                adresse2 : entreprise.adresse2,
                code_postal : entreprise.code_postal,
                ville : entreprise.ville,
                email : entreprise.email,
                siret : entreprise.siret,
                telephone : entreprise.telephone,
                rcs: entreprise.rcs
            }

            data.settings.entreprise = ipcRenderer.sendSync("database.saveEntrepriseSettings", _entreprise);
        }
    }
    return data;
}
export default createAction(restoreFromJSON);