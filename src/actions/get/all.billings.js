import createAction from '../../middleware/actions';

export async function getAllFactures({ extra, getState }) {
    try {
        let factures = [];
        let electron = extra.electron;
        electron.ipcRenderer.send('executeQuery',"SELECT * from factures");
        /*
        const state = getState();
        let factures = state.factures;
        factures = factures.map((el) => {
            if ( el.vehicule_plate != undefined ){
                let vehicule = state.vehicules.filter((_el) => _el.plate == el.vehicule_plate);
                el.vehicule = {...vehicule[0]};
            }
            return el;
        })*/


        return { factures : factures};
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getAllFactures);