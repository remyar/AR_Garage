import createAction from '../../middleware/actions';


export async function getAllManufacturers({ extra, getState }) {
    const api = extra.api;

    try {
        let manufacturers = await api.get("/data/Manufacturers/all.json");

        return {
            manufacturers: manufacturers?.data?.array || []
        }

    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getAllManufacturers);