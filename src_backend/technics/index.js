const fs = require('fs');
const path = require("path");
const StreamZip = require('node-stream-zip');

let dtabasePath = undefined;

async function setdbPath(_path, options) {
    const zip = new StreamZip.async({ file: _path });
    dtabasePath = zip;
}

async function readFileSync(_databaseName) {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await dtabasePath.entryData(_databaseName + ".json");
            let result = JSON.parse(data.toString());
            resolve(result);
        } catch (err) {
            reject(err);
        }
    })
}


async function getManufacturers() {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await readFileSync("101_ID_MAKES");
            resolve(result || []);
        } catch (err) {
            resolve([]);
        }
    });
}

async function getManufacturerById(id) {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await readFileSync("101_ID_MAKES");
            resolve(result.filter(e => e.make_id == parseInt(id.toString())) || []);
        } catch (err) {
            resolve([]);
        }
    });
}

async function getModelSeries(manuId) {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await readFileSync("102_ID_MODELS");
            resolve(result.filter(e => e.make_id == parseInt(manuId.toString())) || []);
        } catch (err) {
            resolve([]);
        }
    });
}

async function getModelSeriesById(modelId) {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await readFileSync("102_ID_MODELS");
            resolve(result.filter(e => e.model_id == parseInt(modelId.toString())) || []);
        } catch (err) {
            resolve([]);
        }
    });
}

async function getTechnicsEntry(tecdocid){
    return new Promise(async (resolve, reject) => {
        try {
            const data = await readFileSync("105_ID_TECDOC_LINK");
            resolve(data.filter((e) => e.ktypnr == tecdocid));
        } catch (err) {
            reject(err);
        }
    });
}

async function getMotorByModelId(modelId){
    return new Promise(async (resolve, reject) => {
        try {
            const data = await readFileSync("103_ID_TYPES");
            resolve(data.filter((e) => parseInt(e.model_id.toString()) == modelId));
        } catch (err) {
            reject(err);
        }
    });
}

async function getMotorById(motorId) {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await readFileSync("103_ID_TYPES");
            resolve(data.filter((e) => parseInt(e.type_id.toString()) == motorId));
        } catch (err) {
            reject(err);
        }
    });
}

async function getMaintenanceByTypeId(typeId){
    return new Promise(async (resolve, reject) => {
        try {
            let maintSystems = await readFileSync("200_MAINT_SYSTEMS");
            let typesMaintenances = await readFileSync("201_TYPES_MAINTENANCE");
            let maintSystemDescriptionBeforeCriteria = await readFileSync("202_BEFORE_CRITERIA");
            let maintSystemDescription = await readFileSync("202_MAINT_SYSTEM_DESCRIPTION");
            
            typesMaintenances = typesMaintenances.filter((e) => parseInt(e.type_id.toString()) == typeId);

            for (let tm of typesMaintenances){
                tm.maintSystems = maintSystems.filter((e) => parseInt(e.maint_system_id.toString()) == parseInt(tm.maint_system_id.toString()));
                for (let tmms of tm.maintSystems) {
                    tmms.maintSystemDescription = maintSystemDescription.filter((e) => parseInt(e.maint_system_description_id.toString()) == parseInt(tmms.maint_system_description_id.toString()));
                }
                for (tmms of tm.maintSystems){
                    tmms.maintSystemDescriptionBeforeCriteria = maintSystemDescriptionBeforeCriteria.filter((e) => parseInt(e.maint_system_description_id.toString()) == parseInt(tmms.maint_sys_desc_id_before_crit.toString()))
                }
            }
            console.log(typesMaintenances);
            resolve(typesMaintenances);
        } catch (err) {
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
    getMaintenanceByTypeId

}