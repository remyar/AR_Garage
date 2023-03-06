import fetch from 'electron-fetch';

global.cookieString = "";
global.oscaroCookie = { __cf_bm : "" , __anti_forgery_token : "" , csrfToken : ""};
export default function get(url, config = {}) {
    return new Promise(async (resolve, reject) => {
        try {
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), 30000);

            config.headers = {...config.headers, "set-cookie" : global.cookieString , "cookie" : global.cookieString};
            if ( url.includes("oscaro") ){
                config.headers["set-cookie"] = "__cf_bm=" + global.oscaroCookie.__cf_bm + "; __anti-forgery-token=" + global.oscaroCookie.__anti_forgery_token;

                if ( global.oscaroCookie.csrfToken != "" ){
                    config.headers["x-csrf-token"] = global.oscaroCookie.csrfToken;
                }
            }
            const response = await fetch(url , { ...config , useElectronNet : false , signal: controller.signal , credentials: "same-origin" , useSessionCookies : true});

            clearTimeout(id);

            global.cookieString = response.headers.get('set-cookie');
            if ( url.includes("oscaro") ){
                global.cookieString?.split(";").forEach((coo)=>{
                    if ( coo.includes("__cf_bm") ){
                        global.oscaroCookie.__cf_bm = coo.replace(",__cf_bm=" , "");
                    }
                    if ( coo.includes("__anti-forgery-token") ){
                        global.oscaroCookie.__anti_forgery_token = coo.replace("__anti-forgery-token=" , "");
                    }
                })
            }
            if ( response.status == 200){
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
                if ( url.includes("oscaro") ){
                    if ( r["csrf-token"] != undefined ){
                        global.oscaroCookie.csrfToken = r["csrf-token"];
                    }
                }
                resolve(r)
            } else if ( response.status == 404 ){
                reject({message : "Not found"});
            } else if ( response.status == 204 ){
                reject({message : "Unknow Vehicule"});
            } else if ( response.status == 500 ){
                reject({message : "Temporary unavailable"});
            } else {
                reject({message : "To many request"});
            }
        } catch (err) {
            reject(err);
        }
    });
}
