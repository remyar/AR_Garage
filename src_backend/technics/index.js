const fs = require('fs');
const path = require("path");
const StreamZip = require('node-stream-zip');
const BigJSON = require('../big_json');


let dtabasePath = undefined;

async function setdbPath(_path, options) {
    const zip = new StreamZip.async({ file: _path });
    dtabasePath = zip;
}

async function readFileSync(_databaseName) {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await dtabasePath.entryData(_databaseName + ".json");
            BigJSON.createParseStream({
                body: data,
                onData: (result) => {
                    resolve(result);
                },
                onError: (err) => {
                    reject(err);
                }
            });
        } catch (err) {
            reject(err);
        }
    })
}


async function getManufacturers() {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await readFileSync("ar_makes");
            resolve(result || []);
        } catch (err) {
            resolve([]);
        }
    });
}

async function getManufacturerById(id) {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await readFileSync("ar_makes");
            resolve(result.filter(e => e.make_id == id) || []);
        } catch (err) {
            resolve([]);
        }
    });
}

async function getModelSeries(manuId) {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await readFileSync("ar_models");
            resolve(result.filter(e => e.make_id == manuId) || []);
        } catch (err) {
            resolve([]);
        }
    });
}

async function getModelSeriesById(modelId) {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await readFileSync("ar_models");
            resolve(result.filter(e => e.model_id == modelId) || []);
        } catch (err) {
            resolve([]);
        }
    });
}


async function getTechnicsEntry(tecdocid) {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await readFileSync("ar_id_tecdoc_link");
            let results = data.filter((e) => e.ktypnr == tecdocid)
            resolve(results);
        } catch (err) {
            reject(err);
        }
    });
}

async function getMotorByModelId(id) {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await readFileSync("ar_types");
            resolve(data.filter((e) => e.model_id == id));
        } catch (err) {
            reject(err);
        }
    });
}

async function getMotorById(id) {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await readFileSync("ar_types");
            resolve(data.filter((e) => e.type_id == id));
        } catch (err) {
            reject(err);
        }
    });
}

async function getAdjustmentByTypeId(id) {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await readFileSync("ar_adjustment_items");
            resolve(data.filter((e) => e.type_id == id));
        } catch (err) {
            reject(err);
        }
    });
}

async function getAdjustementsHeaders() {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await readFileSync("ar_adjustment_headers");
            resolve(data);
        } catch (err) {
            reject(err);
        }
    });
}

async function getAdjustementHeaderById(id) {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await readFileSync("ar_adjustment_headers");
            resolve(data.filter((e) => e.adj_header_id == id));
        } catch (err) {
            reject(err);
        }
    });
}

async function getAdjustementsSentences() {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await readFileSync("ar_adjustment_sentences");
            resolve(data);
        } catch (err) {
            reject(err);
        }
    });
}

async function getModelFromTecdocId(_id) {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await getTechnicsEntry(_id);
            let ids = data.filter((e) => (e.internal_ktypnr == 0));

            if ( ids.length > 0){
                let id = ids[0];
                let types = await getMotorById(id.type_id);
                if (types.length > 0) {
                    let type = types[0];

                    let models = await getModelSeriesById(type.model_id);
                    resolve(models);
                    return;
                }
            } 
            resolve([]);
        }
        catch (err) {
            reject(err);
        }
    });
}

module.exports = {
    setdbPath,
    getTechnicsEntry,
    getMotorByModelId,
    getMotorById,
    getManufacturers,
    getManufacturerById,
    getModelSeries,
    getModelSeriesById,
    getAdjustmentByTypeId,
    getAdjustementsHeaders,
    getAdjustementHeaderById,
    getAdjustementsSentences,
    getModelFromTecdocId
}