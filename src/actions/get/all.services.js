import createAction from '../../middleware/actions';

export async function getAllServices({ extra, getState }) {
    const database = extra.database;

    try {
        let _result = await database.getAllServices();
        
        return {
            services : _result
        }

    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getAllServices);