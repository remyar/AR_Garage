const fetch = require('electron-fetch').default;

async function get( options) {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await fetch(options.url);
            if (response.status == 200) {
                let r = undefined;
                if (response.headers.get('content-type').includes("text/html")) {
                    r = await response.text();
                }else if (response.headers.get('content-type').includes("application/json")) {
                    r = await response.json();
                }
                resolve(r);
            }
        } catch (err) {
            reject(err);
        }
    });
}


module.exports = {
    get,
}