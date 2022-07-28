import createAction from '../../middleware/actions';

export async function getMotorisations(manuId , { extra, getState }) {

    try {

        let data = require('./../../data/tecdoc/motorisation/' + manuId + '.json');

        return { motorisation : data };
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getMotorisations);