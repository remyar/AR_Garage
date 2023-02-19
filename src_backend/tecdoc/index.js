const fs = require('fs');
const path = require("path");

let dtabasePath = undefined;
let id = 20450;

async function setdbPath(_path, options) {
    dtabasePath = _path;
}

async function readFileSync(_databaseName) {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(path.resolve(dtabasePath, _databaseName + ".json"))) {
            let result = fs.readFileSync(path.resolve(dtabasePath, _databaseName + ".json"));
            result = JSON.parse(result);
            resolve(result);
        } else {
            reject();
        }
    })
}

async function getChildNodesAllLinkingTarget() {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await readFileSync("ChildNodesAllLinkingTarget/" + id);
            resolve(result?.data?.array);
        } catch (err) {
            reject(err);
        }
    });
}

async function getAmBrands() {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await readFileSync("AmBrands/"+id);
            resolve(result);
        } catch (err) {
            reject(err);
        }
    });
}

async function getManufacturers() {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await readFileSync("Manufacturers/" + id);
            resolve(result?.data?.array || []);
        } catch (err) {
            reject(err);
        }
    });
}

async function getModelSeries(manuId) {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await readFileSync("ModelSeries/" + manuId);
            resolve(result?.data?.array || []);
        } catch (err) {
            reject(err);
        }
    });
}

async function getVehicle(modelId) {
    return new Promise((resolve, reject) => {
        let dir = fs.readdirSync(path.resolve(dtabasePath, "Vehicle"));
        let result = undefined;
        dir.forEach((_dir) => {
            if (result == undefined) {
                if (fs.existsSync(path.resolve(dtabasePath, "Vehicle", _dir, modelId + ".json"))) {
                    result = fs.readFileSync(path.resolve(dtabasePath, "Vehicle", _dir, modelId + ".json"));
                    result = JSON.parse(result);
                }
            }
        });

        resolve(result?.data?.array || []);
    });
}

async function getVehiculeByCarId(carId) {
    return new Promise((resolve, reject) => {
        let dir = fs.readdirSync(path.resolve(dtabasePath, "Vehicle"));
        let result = undefined;
        dir.forEach((_dir) => {
            if (result == undefined) {
                let __dir = fs.readdirSync(path.resolve(dtabasePath, "Vehicle", _dir));
                __dir.forEach((___dir) => {
                    let _result = fs.readFileSync(path.resolve(dtabasePath, "Vehicle", _dir, ___dir));
                    _result = JSON.parse(_result);
                    _result.data.array.forEach((__result) => {
                        if (__result.carId == carId) {
                            result = { ...__result, manuId: _dir, modId: ___dir.replace('.json', '') };
                        }
                    })

                });
            }
        })
        resolve(result);
    });
}

async function getAssemblyGroupFacets(carId) {
    return new Promise((resolve, reject) => {
        let dir = fs.readdirSync(path.resolve(dtabasePath, "Articles"));
        let result = undefined;
        dir.forEach((_dir) => {
            if (result == undefined) {
                let _result = fs.readFileSync(path.resolve(dtabasePath, "Articles", _dir, carId + ".json"));
                _result = JSON.parse(_result);
                result = _result?.assemblyGroupFacets?.counts;
            }
        });
        resolve(result);
    });
}

async function getArticleIdsWithState(args) {
    return new Promise((resolve, reject) => {
        let dir = fs.readdirSync(path.resolve(dtabasePath, "ArticlesStates"));
        let result = undefined;
        dir.forEach((_dir) => {
            if (fs.existsSync(path.resolve(dtabasePath, "ArticlesStates", _dir, "" + args.assemblyGroupNodeId + "", "" + args.carId + ".json"))) {
                result = fs.readFileSync(path.resolve(dtabasePath, "ArticlesStates", _dir, "" + args.assemblyGroupNodeId + "", "" + args.carId + ".json"));
                result = JSON.parse(result);
                result = result?.data?.array || [];
            }
        });
        resolve(result);
    });
}


async function getArticleLinkIds(articleLinkId) {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await readFileSync("DirectArticles/" + articleLinkId);
            resolve(result?.data?.array || []);
        } catch (err) {
            reject(err);
        }
    });
}

async function getArticleDocuments(documentId) {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await readFileSync("Documents/" + documentId);
            resolve(result);
        } catch (err) {
            resolve(err);
        }
    });
}

module.exports = {
    setdbPath,

    getChildNodesAllLinkingTarget,
    getAmBrands,
    getManufacturers,
    getModelSeries,
    getVehicle,

    getVehiculeByCarId,
    getAssemblyGroupFacets,
    getArticleIdsWithState,
    getArticleLinkIds,
    getArticleDocuments
}