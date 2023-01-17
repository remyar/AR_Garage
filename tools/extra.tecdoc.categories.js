
require('dotenv').config({ path: './.env.local' });
const fetch = require('node-fetch');
let db = require('../src_backend/database')
const cliProgress = require('cli-progress');

const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);


async function post(obj, url) {
    return new Promise(async (resolve, reject) => {
        let headers = {};
        if (obj.headers != undefined) {
            headers = { ...obj.headers };
        }
        try {
            let result = await fetch(url,
                {
                    method: 'POST',
                    body: JSON.stringify(obj),
                    useElectronNet: false,
                    headers,
                    credentials: "same-origin",
                    useSessionCookies: true
                });
            let r = await result.json();
            resolve(r);
        } catch (err) {
            reject(err);
        }
    });
}

async function get(url , obj){
    return new Promise(async (resolve, reject) => {
        let headers = {};
        if (obj?.headers != undefined) {
            headers = { ...obj.headers };
        }
        try {
            let result = await fetch(url,
                {
                    method: 'GET',
                    useElectronNet: false,
                    headers,
                    credentials: "same-origin",
                    useSessionCookies: true
                });
            let r = await result.json();
            resolve(r);
        } catch (err) {
            reject(err);
        }
    });
}

async function getTecDocAllCategories() {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await post({
                getChildNodesAllLinkingTarget2: {
                    "arg0": {
                        "childNodes": true,
                        "linkingTargetType": "P",
                        "lang": "FR",
                        "provider": process.env.REACT_APP_TECDOC_PROVIDER_ID_NEW
                    }
                }
            }, process.env.REACT_APP_TECDOC_API_URL_3);

            resolve(response.data.array)
        } catch (err) {
            reject([]);
        }
    });
}

async function getTecDocAllAmBrands() {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await post({
                getAmBrands: {
                    "arg0": {
                        "lang": "FR",
                        "articleCountry": "FR",
                        "provider": process.env.REACT_APP_TECDOC_PROVIDER_ID_NEW
                    }
                }
            }, process.env.REACT_APP_TECDOC_API_URL_3);

            resolve(response.data.array)
        } catch (err) {
            reject([]);
        }
    });
}

async function getAllCodePostaux(){
    return new Promise(async (resolve, reject) => {
        try {
            const response = await get(process.env.REACT_APP_GOUV_CODE_POSTAUX_URL);
            resolve(response);
        } catch (err) {
            reject([]);
        }
    });
}

async function getAllConstructeurs(){
    return new Promise(async (resolve, reject) => {
        try {
            const response = await post({
                getManufacturers2: {
                    "arg0": {
                        "lang": "FR",
                        "country": "FR",
                        "linkingTargetType": "P",
                        "provider": process.env.REACT_APP_TECDOC_PROVIDER_ID_NEW
                    }
                }
            }, process.env.REACT_APP_TECDOC_API_URL_3);

            resolve(response.data.array)
        } catch (err) {
            reject([]);
        }
    });
}

async function _start() {
    await db.setdbPath("./database.sqlite");
    let categories = await getTecDocAllCategories();
    bar1.start(categories.length, 0);
    let idx = 0;
    for ( let element of categories){
        try {
            idx++;
            bar1.update(idx);
          /*  await db.saveCategorie({
                nom : element.assemblyGroupName,
                parent_id : element.parentNodeId,
                tecdocId : element.assemblyGroupNodeId,
                hasChilds : element.hasChilds
            })*/
        } catch (err) {
            bar1.stop();
            console.err("fail to insert categorie");
        }
    };

    bar1.stop();

    let brands = await getTecDocAllAmBrands();
    bar1.start(brands.length, 0);
    idx = 0;
    for ( let element of brands){
        try {
            idx++;
            bar1.update(idx);
          /*  await db.saveMarque({
                nom : element.brandName,
                tecdocId : element.brandId,
                logoId : element.brandLogoID
            });*/
        } catch(err){
            bar1.stop();
            console.err("fail to insert marque");
        }
    }
    bar1.stop();

/*    let codePostaux = await getAllCodePostaux();
    bar1.start(codePostaux.length, 0);
    idx = 0;
    for ( let element of codePostaux){
        try {
            idx++;
            bar1.update(idx);
            await db.saveCodePostal({
                code_postal : element.fields.code_postal,
                nom_de_la_commune : element.fields.nom_de_la_commune
            })
        } catch(err){
            bar1.stop();
            console.err("fail to insert marque");
        }
    }
    bar1.stop();*/

    let constructeurs = await getAllConstructeurs();
    bar1.start(constructeurs.length, 0);
    idx = 0;
    for ( let element of constructeurs){
        try {
            idx++;
            bar1.update(idx);
            await db.saveConstructeur({
                tecdocId : element.manuId,
                nom : element.manuName
            })
        } catch(err){
            bar1.stop();
            console.err("fail to insert constructeur");
        }
    }
    bar1.stop();
}

_start();
