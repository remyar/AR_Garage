import createAction from '../../middleware/actions';

export async function installationProgress(value = {}, { extra, getState }) {
    try {
        return {
            installationProgress: {...value}
        };
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(installationProgress);