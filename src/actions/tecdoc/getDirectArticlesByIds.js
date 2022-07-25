import createAction from '../../middleware/actions';

export async function getDirectArticlesByIds(id, { extra, getState }) {

    const api = extra.api;
    try {
        let r = [];
        let ids = [];
        let _id = [];
        for (let i = 0; i < id.length; i++) {

            if ((i != 0) && ((i % 20) == 0)) {
                ids.push([..._id]);
                _id = [];
            }

            _id.push(id[i]);
        }

        for (let __id of ids) {
            let result = await api.tecdoc.getDirectArticlesByIds(__id);

            result.forEach((el)=>{
                r.push(el);
            })
        }
        return { articlesByIds: r };

    } catch (err) {

        throw { message: err.message };

    }
}

export default createAction(getDirectArticlesByIds);