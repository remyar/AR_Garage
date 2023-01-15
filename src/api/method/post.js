import fetch from 'electron-fetch';

export default function post(url, data, config = {}) {
    return new Promise(async (resolve, reject) => {
        try {

            let _c = {
                method: 'POST',
                body: typeof data == 'string' ? data : JSON.stringify(data),
                useElectronNet: false,
                credentials: "same-origin",
                useSessionCookies: true
            };

            if (config) {
                if (config.headers) {
                    _c.headers = { ...config.headers };
                }
            }

            _c.headers = { ..._c.headers, "cookie": global.cookieString };

            if (url.includes("oscaro")) {
                _c.headers["set-cookie"] = "__cf_bm=" + global.oscaroCookie.__cf_bm + "; __anti-forgery-token=" + global.oscaroCookie.__anti_forgery_token;

                if (global.oscaroCookie.csrfToken != "") {
                    _c.headers["x-csrf-token"] = global.oscaroCookie.csrfToken;
                }
            }
            const response = await fetch(url, _c);

            if (response.status == 200) {
                let r = undefined;
                if ( config && config.responseType && config.responseType == 'arraybuffer'){
                    r = await response.arrayBuffer();
                } else {
                    if ( response.headers.get('content-type').includes("text/html") ){
                        r = await response.text();
                    } else if  ( response.headers.get('content-type').includes("application/json") ){
                        r = await response.json();
                    }
                }
                resolve(r);
            } else if (response.status == 404) {
                reject({ message: "Not found" });
            } else if (response.status == 500) {
                reject({ message: "Temporary unavailable" });
            } else {
                reject({ message: "To many request" });
            }
        } catch (err) {
            reject(err);
        }
    });
}