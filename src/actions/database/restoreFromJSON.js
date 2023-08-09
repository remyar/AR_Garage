import createAction from '../../middleware/actions';

export async function restoreFromJSON(data, { extra, getState }) {
    try{
        const database = extra.database;

        await database.restore(data);

        let settings = await database.getSettings();
        return {settings : settings}
    }catch(err){
        throw { message: err.message };
    }
}

export default createAction(restoreFromJSON);