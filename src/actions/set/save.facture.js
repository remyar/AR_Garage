import createAction from '../../middleware/actions';

export async function saveFacture(value = {}, { extra, getState }) {
    const database = extra.database;

    try {
        
        await database.saveFacture({...value});

        return {
            facture : value
        };
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(saveFacture);