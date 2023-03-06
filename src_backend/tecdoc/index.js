const fs = require('fs');
const path = require("path");
const fetch = require('electron-fetch').default;
const { createWriteStream } = require('fs');
const { pipeline } = require('stream');
const { promisify } = require('util');
const extract = require('extract-zip')

let dtabasePath = undefined;
let id = 20754;
let mainWindow = undefined;

async function setdbPath(_path, options) {
    dtabasePath = _path;
}

async function setMainWindows(_mainWindow) {
    mainWindow = _mainWindow;
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
            let result = await readFileSync("AmBrands/" + id);
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
            resolve([]);
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
        let result = [];
        dir.forEach((_dir) => {
            let _result = fs.readFileSync(path.resolve(dtabasePath, "Articles", _dir, carId + ".json"));
            _result = JSON.parse(_result);
            _result = _result?.assemblyGroupFacets?.counts || [];
            result = [...result, ..._result];
        });
        resolve(result);
    });
}

async function getArticleIdsWithState(args) {
    return new Promise((resolve, reject) => {
        let dir = fs.readdirSync(path.resolve(dtabasePath, "ArticlesStates"));
        let _result = [];
        dir.forEach((_dir) => {
            if (fs.existsSync(path.resolve(dtabasePath, "ArticlesStates", _dir, "" + args.assemblyGroupNodeId + "", "" + args.carId + ".json"))) {
                let result = fs.readFileSync(path.resolve(dtabasePath, "ArticlesStates", _dir, "" + args.assemblyGroupNodeId + "", "" + args.carId + ".json"));
                result = JSON.parse(result);
                result = result?.data?.array || [];
                _result = [..._result, ...result];
            }
        });
        resolve(_result);
    });
}


async function getArticleLinkIds(articleLinkId) {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await readFileSync("DirectArticles/" + articleLinkId);
            resolve(result?.data?.array || []);
        } catch (err) {
            console.error(err);
            resolve([]);
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



async function DownloadFile({ url, p }) {
    let __path = "";
    let decompPath = p.split(path.sep);
    if (decompPath[decompPath.length - 1].includes(".")) {
        //-- filename is included
        decompPath.pop();
    }
    for (let _path of decompPath) {
        _path = __path + path.sep + _path;
        if (_path.startsWith(path.sep)) {
            _path = _path.replace(path.sep, '');
        }
        if (fs.existsSync(_path) == false) {
            fs.mkdirSync(_path);
        }
        __path = _path;
    }


    let totalFile = 0;
    let actualFile = 0;

    const streamPipeline = promisify(pipeline);

    const response = await fetch(url);

    totalFile = response.headers.get('content-length');

    if (!response.ok) {
        throw new Error(`unexpected response ${response.statusText}`);
    }

    let lastPercent = -1;
    response.body.on("data", (chunk) => {
        actualFile += chunk.length;

        let progressObj = {
            bytesPerSecond: 0,
            percent: parseInt((actualFile / totalFile) * 100),
            transferred: actualFile,
            total: totalFile,
        }

        if (lastPercent != progressObj.percent) {
            if ((parseInt(progressObj.percent) % 10) == 0) {
                mainWindow.webContents.send('download-progress', progressObj);
            }
            lastPercent = parseInt(progressObj.percent);
        }
    });

    await streamPipeline(response.body, createWriteStream(p));
}

async function downloadDatabase(amBrands) {

    return new Promise(async (resolve, reject) => {

        try {

            for (let ambBrand of amBrands) {

                let databasename = "tecdoc_database_" + ambBrand + ".zip"
                if (fs.existsSync(path.resolve(dtabasePath, databasename)) == false) {
                    await DownloadFile({ url: "https://www.goodrace.fr/download/" + databasename, p: path.resolve(dtabasePath, databasename) });
                }

                mainWindow.webContents.send('extract-start');
                let lastPercent = 0;
                await extract(path.resolve(dtabasePath, databasename), {
                    dir: path.resolve(dtabasePath), onEntry: (entry, zipFile) => {
                        let progressObj = {
                            bytesPerSecond: 0,
                            percent: parseInt((zipFile.entriesRead / zipFile.entryCount) * 100),
                            transferred: zipFile.entriesRead,
                            total: zipFile.entryCount,
                        }

                        if (lastPercent != progressObj.percent) {
                            if ((parseInt(progressObj.percent) % 10) == 0) {
                                mainWindow.webContents.send('extract-progress', progressObj);
                            }
                            lastPercent = parseInt(progressObj.percent);
                        }

                    }
                });

                mainWindow.webContents.send('extract-end', ambBrand);

                if (fs.existsSync(path.resolve(dtabasePath, databasename))) {
                    fs.rmSync(path.resolve(dtabasePath, databasename));
                }
            }

            resolve();
        } catch (err) {
            if (fs.existsSync(path.resolve(dtabasePath, "tecdoc_database.zip"))) {
                fs.rmSync(path.resolve(dtabasePath, "tecdoc_database.zip"));
            }
            reject(err);
        }

    });
}


async function downloadTesseract() {

    const download = async ({ url, p }) => {


        let __path = "";
        let decompPath = p.split(path.sep);
        if (decompPath[decompPath.length - 1].includes(".")) {
            //-- filename is included
            decompPath.pop();
        }
        for (let _path of decompPath) {
            _path = __path + path.sep + _path;
            if (_path.startsWith(path.sep)) {
                _path = _path.replace(path.sep, '');
            }
            if (fs.existsSync(_path) == false) {
                fs.mkdirSync(_path);
            }
            __path = _path;
        }




        let totalFile = 0;
        let actualFile = 0;

        const streamPipeline = promisify(pipeline);

        const response = await fetch(url);

        totalFile = response.headers.get('content-length');

        if (!response.ok) {
            throw new Error(`unexpected response ${response.statusText}`);
        }

        let lastPercent = -1;
        response.body.on("data", (chunk) => {
            actualFile += chunk.length;

            let progressObj = {
                bytesPerSecond: 0,
                percent: parseInt((actualFile / totalFile) * 100),
                transferred: actualFile,
                total: totalFile,
            }

            if (lastPercent != progressObj.percent) {
                mainWindow.webContents.send('download-progress', progressObj);
                lastPercent = parseInt(progressObj.percent);
            }
        });

        await streamPipeline(response.body, createWriteStream(p));
    };

    return new Promise(async (resolve, reject) => {

        try {

            console.log(dtabasePath);

            if (fs.existsSync(path.resolve(dtabasePath, "..", "tesseract", "tesseract.exe")) == false) {


                if (fs.existsSync(path.resolve(dtabasePath, "..", "tesseract", "tesseract.zip")) == false) {
                    await download({ url: "https://www.goodrace.fr/download/tesseract.zip", p: path.resolve(dtabasePath, "..", "tesseract", "tesseract.zip") });
                }

                mainWindow.webContents.send('extract-start');
                let lastPercent = 0;
                await extract(path.resolve(dtabasePath, "..", "tesseract", "tesseract.zip"), {
                    dir: path.resolve(dtabasePath, "..", "tesseract"), onEntry: (entry, zipFile) => {
                        let progressObj = {
                            bytesPerSecond: 0,
                            percent: parseInt((zipFile.entriesRead / zipFile.entryCount) * 100),
                            transferred: zipFile.entriesRead,
                            total: zipFile.entryCount,
                        }

                        if (lastPercent != progressObj.percent) {
                            mainWindow.webContents.send('extract-progress', progressObj);
                            lastPercent = parseInt(progressObj.percent);
                        }

                    }
                });

                mainWindow.webContents.send('extract-end');

                if (fs.existsSync(path.resolve(dtabasePath, "..", "tesseract", "tesseract.zip"))) {
                    fs.unlinkSync(path.resolve(dtabasePath, "..", "tesseract", "tesseract.zip"));
                }
            }
            resolve();
        } catch (err) {
            if (fs.existsSync(path.resolve(dtabasePath, "..", "tesseract", "tesseract.zip"))) {
                fs.unlinkSync(path.resolve(dtabasePath, "..", "tesseract", "tesseract.zip"));
            }
            reject(err);
        }

    });
}

async function removeTecDocDatabase(amBrands) {
    return new Promise(async (resolve, reject) => {
        try {
            let jsonFile = [];
            if (fs.existsSync(path.resolve(dtabasePath, "AmBrands", id + ".json"))) {
                let _result = await readFileSync("AmBrands/" + id);
                jsonFile = _result?.data?.array || [];
            }

            for (let amBrand of amBrands) {
                let _result = jsonFile.find((el) => el.brandName == amBrand);
                console.log(path.resolve(dtabasePath, "Articles", _result.brandId.toString()))
                if (fs.existsSync(path.resolve(dtabasePath, "Articles", _result.brandId.toString()))) {
                    fs.rmdirSync(path.resolve(dtabasePath, "Articles", _result.brandId.toString()), { recursive: true });
                }
                if (fs.existsSync(path.resolve(dtabasePath, "ArticlesStates", _result.brandId.toString()))) {
                    fs.rmdirSync(path.resolve(dtabasePath, "ArticlesStates", _result.brandId.toString()), { recursive: true });
                }
            }

            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

module.exports = {
    setdbPath,
    setMainWindows,
    downloadDatabase,
    downloadTesseract,
    removeTecDocDatabase,

    getChildNodesAllLinkingTarget,
    getAmBrands,
    getManufacturers,
    getModelSeries,
    getVehicle,

    getVehiculeByCarId,
    getAssemblyGroupFacets,
    getArticleIdsWithState,
    getArticleLinkIds,
    getArticleDocuments,
}