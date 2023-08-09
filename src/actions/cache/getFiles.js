import createAction from '../../middleware/actions';


export async function getFiles({ extra, getState }) {
    const api = extra.api;

    try {
        let files = [];
        const urls = [
            "/cache/VehicleDetails/getFiles.json",
            "/cache/Manufacturers/getFiles.json",
            "/cache/ModelSeries/getFiles.json",
            "/cache/Vehicle/getFiles.json",
        ];

        for (let url of urls) {
            let result = await api.get(url, { cache: "no-cache" });
            files = [...files, ...result.files];
        }

        return { cacheFiles: files }
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getFiles);