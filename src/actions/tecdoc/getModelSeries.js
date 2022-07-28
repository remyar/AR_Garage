import createAction from '../../middleware/actions';

export async function getModelSeries(manuId , { extra, getState }) {

    try {

        let data = require('./../../data/tecdoc/model/' + manuId + '.json');

        return { modelSeries : data };
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getModelSeries);