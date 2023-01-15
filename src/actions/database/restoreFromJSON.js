import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';
import { forEach } from 'lodash';

export async function restoreFromJSON(data, { extra, getState }) {

    if (data.settings != undefined) {
        let settings = data.settings;
        if (settings.entreprise != undefined) {
            let entreprise = settings.entreprise;
            let _entreprise = {
                nom: entreprise.nom,
                adresse1: entreprise.adresse1,
                adresse2: entreprise.adresse2,
                code_postal: entreprise.code_postal,
                ville: entreprise.ville,
                email: entreprise.email,
                siret: entreprise.siret,
                telephone: entreprise.telephone,
                rcs: entreprise.rcs
            };

            data.settings.entreprise = ipcRenderer.sendSync("database.saveEntrepriseSettings", _entreprise);
        }
        if (settings.paiement != undefined) {
            let paiement = settings.paiement;
            let _paiement = {
                nom: paiement.nom,
                iban: paiement.iban,
                order: paiement.order
            };

            data.settings.paiement = ipcRenderer.sendSync("database.savePaiementSettings", _paiement);
        }
        if (settings.logo != undefined) {
            data.settings.logo = ipcRenderer.sendSync("database.saveLogoSettings", settings.logo);
        }
    }
    if (data.clients != undefined) {
        data.clients = data.clients.sort((a, b) => a.id > b.id ? 1 : -1);

        data.clients.forEach((client)=>{
            let _client = {
                id : client.id+1,
                nom : client.nom,
                prenom : client.prenom,
                adresse1: client.adresse1,
                adresse2: client.adresse2,
                code_postal: client.code_postal,
                ville: client.ville,
                telephone: client.telephone,
                email: client.email,
            };

            client = ipcRenderer.sendSync("database.saveClient", _client);
        })
    }

    return data;
}
export default createAction(restoreFromJSON);