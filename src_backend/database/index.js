const fs = require('fs');
const path = require("path");

let dtabasePath = undefined;
let id = 20754;

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

module.exports = {
    setdbPath,
    getManufacturers,
    getModelSeries,
    getVehicle
}