import createAction from '../../middleware/actions';

export async function dumpFromDB({ extra, getState }) {
    try{
        const database = extra.database;

        let dump = await database.dump();

        return {dump : dump}
    }catch(err){
        throw { message: err.message };
    }
}

export default createAction(dumpFromDB);