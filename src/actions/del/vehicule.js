import createAction from '../../middleware/actions';

export async function delVehicule(idToDelete, { extra, getState }) {

    const database = extra.database;

    try {
        let data = await database.getVehiculeById(idToDelete);
        if ( data != undefined ){
            data.deleted = true;
        }
        await database.saveVehicule(data);
        return { 
            vehicule : data
        };
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(delVehicule);