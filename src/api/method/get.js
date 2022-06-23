import fetch from 'isomorphic-fetch';

export default function get(url, config = {}) {
    return new Promise(async (resolve, reject) => {
        try {
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), 30000);

            const response = await fetch(url , { ...config , useElectronNet : false , signal: controller.signal});

            clearTimeout(id);

            if ( response.status == 200){
                let r = undefined;
                if ( config && config.responseType && config.responseType == 'arraybuffer'){
                    r = await response.arrayBuffer();
                } else {
                    r = await response.text();
                }
                resolve(r)
            } else if ( response.status == 404 ){
                reject({message : "Not found"});
            } else if ( response.status == 500 ){
                reject({message : "Temporary unavailable"});
            }
        } catch (err) {
            reject(err);
        }
    });
}
