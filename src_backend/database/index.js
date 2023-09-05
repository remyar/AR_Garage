const fs = require('fs');
const path = require("path");
const StreamZip = require('node-stream-zip');

let dtabasePath = undefined;
let id = 20754;

async function setdbPath(_path, options) {
    const zip = new StreamZip.async({ file: _path });
    dtabasePath = zip;
}

async function readFileSync(_databaseName) {
    return new Promise(async (resolve, reject) => {
        try{
            const data = await dtabasePath.entryData(_databaseName+ ".json");
            let result =  JSON.parse(data.toString());
            resolve(result);
        } catch(err){
            reject(err);
        }
    })
}

async function getManufacturers() {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await readFileSync("Manufacturers/" + id);
            resolve(result?.data?.array || []);
        } catch (err) {
            resolve([]);
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
    return new Promise(async (resolve, reject) => {
        try{
            const entries = await dtabasePath.entries();
            let result = undefined;
            for (const entry of Object.values(entries)) {
                if ( entry.name.startsWith("Vehicle/") && entry.name.endsWith(modelId + ".json") ){
                    result = await readFileSync(entry.name.replace(".json", ""));
                }
            }
            resolve(result?.data?.array || []);
        }catch(err){
            resolve([]);
        }
    });
}

async function getVehicleDetails(id){
    return new Promise(async (resolve, reject) => {
        try {
            let result = await readFileSync("VehicleDetails/" + id);
            resolve(result?.data?.array || []);
        } catch (err) {
            resolve([]);
        }
    });
}
module.exports = {
    setdbPath,
    getManufacturers,
    getModelSeries,
    getVehicle,
    getVehicleDetails
}