import fetch from 'electron-fetch';
import image from '../../utils/image'

async function post(obj, url) {
    return new Promise(async (resolve, reject) => {

        let headers = {};

        if (url == undefined) {
            url = process.env.REACT_APP_TECDOC_API_URL_1;
        }

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

async function getCaptcha() {
    return new Promise(async (resolve, reject) => {

        try {
            let resolveObj = undefined;
            for (let i = 0; i < 20; i++) {

                let result = await post({
                    getCaptcha: {
                        catalog: process.env.REACT_APP_TECDOC_API_CATALOG
                    }
                }, process.env.REACT_APP_TECDOC_API_URL_2);

                try {
                    let text = await image.getText(result.image.replace('data:image/png;base64,', ''));
                    resolveObj = {
                        apikey: result.apiKey,
                        captcha: text
                    };
                    break;
                } catch (err) {
                    continue;
                }

            }

            if (resolveObj) {
                resolve(resolveObj);
            } else {
                reject("Fail to find captcha")
            }

        }
        catch (err) {
            reject(err)
        }
    });
}

async function checkCaptcha(obj) {
    return new Promise(async (resolve, reject) => {

        try {

            let result = await post({
                checkCaptcha: { captchaText: obj.captcha },
                headers: { "x-api-key": obj.apikey }
            }, process.env.REACT_APP_TECDOC_API_URL_2);

            resolve(result.valid);
        }
        catch (err) {
            reject(err);
        }
    });
}

async function getVehiclesByKeyNumberPlates(plate) {
    return new Promise(async (resolve, reject) => {
        try {

            let captchaApi = undefined;
            for (let i = 0; i < 50; i++) {
                try {
                    let tryCaptcha = await getCaptcha();
                    let result = await checkCaptcha(tryCaptcha);
                    if (result) {
                        captchaApi = tryCaptcha.apikey
                        break;
                    }
                } catch (err) {
                    continue;
                }
            }

            if (captchaApi) {
                let result = await post({
                    getVehiclesByKeyNumberPlates: {
                        arg0: {
                            country: "FR",
                            details: true,
                            keySystemNumber: plate.toUpperCase(),
                            keySystemType: 50,
                            lang: "fr",
                            linkingTargetType: "PO",
                            picture: false,
                            provider: process.env.REACT_APP_TECDOC_PROVIDER_ID_OLD
                        }
                    },
                    headers: { "x-api-key": captchaApi }
                }, process.env.REACT_APP_TECDOC_API_URL_3);

                resolve(result?.data?.array || []);

            }

        } catch (err) {
            reject(err);
        }
    });
}

async function getArticleIdsWithState(carId, assemblyGroupNodeId, pagination, articlesPerPage) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await post({
                "getArticles": {
                    "arg0": {
                        "articleCountry": "FR",
                        "provider": process.env.REACT_APP_TECDOC_PROVIDER_ID_NEW,
                        "lang": "fr",
                        "assemblyGroupNodeIds": [
                            assemblyGroupNodeId
                        ],
                        "linkageTargetId": carId,
                        "linkageTargetType": "P",
                        "linkageTargetCountry": "FR",
                        "page": pagination || 1,
                        "perPage": articlesPerPage || 100,
                        "sort": [
                            {
                                "field": "mfrName",
                                "direction": "asc"
                            },
                            {
                                "field": "linkageSortNum",
                                "direction": "asc"
                            },
                            {
                                "field": "score",
                                "direction": "desc"
                            }
                        ],
                        "filterQueries": [
                        ],
                        "dataSupplierIds": [],
                        "genericArticleIds": [],
                        "includeAll": false,
                        "includeLinkages": true,
                        "linkagesPerPage": articlesPerPage || 100,
                        "includeGenericArticles": true,
                        "includeArticleCriteria": true,
                        "includeMisc": true,
                        "includeImages": true,
                        "includePDFs": false,
                        "includeLinks": false,
                        "includeArticleText": true,
                        "includeOEMNumbers": false,
                        "includeReplacedByArticles": true,
                        "includeReplacesArticles": true,
                        "includeComparableNumbers": true,
                        "includeGTINs": true,
                        "includeTradeNumbers": true,
                        "includePrices": true,
                        "includeArticleLogisticsCriteria": false,
                        "includeDataSupplierFacets": false,
                        "includeGenericArticleFacets": true,
                        "includeCriteriaFacets": false
                    }
                }
            }, process.env.REACT_APP_TECDOC_API_URL_3);

            resolve(response);

        } catch (err) {
            reject(err);
        }
    });
}

async function getDirectArticlesByIds(articleid) {
    return new Promise(async (resolve, reject) => {
        try {

            const response = await post({
                "getDirectArticlesByIds6": {
                    "articleCountry": "FR",
                    "articleId": {
                        "array": [
                            ...articleid
                        ]
                    },
                    "attributs": true,
                    "basicData": true,
                    "documents": true,
                    "eanNumbers": true,
                    "immediateAttributs": true,
                    "immediateInfo": true,
                    "info": true,
                    "lang": "FR",
                    "mainArticles": true,
                    "normalAustauschPrice": false,
                    "oeNumbers": true,
                    "prices": true,
                    "provider": process.env.REACT_APP_TECDOC_PROVIDER_ID_NEW,
                    "replacedByNumbers": true,
                    "replacedNumbers": true,
                    "thumbnails": true,
                    "usageNumbers": true
                }
            });

            resolve(response?.data?.array);

        } catch (err) {
            reject(err);
        }
    });
}

async function getCategories(carId) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await post({
                "getArticles": {
                    "arg0": {
                        "articleCountry": "FR",
                        "provider": process.env.REACT_APP_TECDOC_PROVIDER_ID_NEW,
                        "lang": "fr",
                        "assemblyGroupFacetOptions": {
                            enabled: true
                        },
                        includeDataSupplierFacets: true,
                        includeGenericArticleFacets: true,
                        lang: "fr",
                        linkageTargetId: carId,
                        linkageTargetType: "V",
                        perPage: 0,
                        provider : process.env.REACT_APP_TECDOC_PROVIDER_ID_NEW,
                    }
                }
            }, process.env.REACT_APP_TECDOC_API_URL_3);

            resolve(response);

        } catch (err) {
            reject(err);
        }
    });
}

export default {
    getVehiclesByKeyNumberPlates,
    getArticleIdsWithState,
    getDirectArticlesByIds,
    getCategories
}
