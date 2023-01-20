const sqlite3 = require('sqlite3').verbose();

let database = undefined;

function getDatabase() {
    return database;
}

async function setdbPath(path) {
    return new Promise((resolve, reject) => {
        database = new sqlite3.Database(path, async (err) => {
            try {
                if (err) {
                    reject("unable to create database");
                } else {
                    resolve();
                }
            } catch (err) {
                reject(err);
            }
        });
    });
}

async function getChildNodesAllLinkingTarget() {
    return new Promise((resolve, reject) => {
        database.serialize(() => {
            database.all("SELECT * FROM ChildNodesAllLinkingTarget", (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    });
}

async function getAmBrands() {
    return new Promise((resolve, reject) => {
        database.serialize(() => {
            database.all("SELECT * FROM AmBrands", (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    });
}

async function getManufacturers(){
    return new Promise((resolve, reject) => {
        database.serialize(() => {
            database.all("SELECT * FROM Manufacturers", (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    });
}

async function getModelSeries(manuId){
    return new Promise((resolve, reject) => {
        database.serialize(() => {
            database.all("SELECT * FROM ModelSeries WHERE manuId=?",[manuId], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    });
}

async function getVehicle(modelId){
    return new Promise((resolve, reject) => {
        database.serialize(() => {
            database.all("SELECT * FROM Vehicle WHERE modId=?",[modelId], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    });
}


module.exports = {
    setdbPath,
    getDatabase,

    getChildNodesAllLinkingTarget,
    getAmBrands,
    getManufacturers,
    getModelSeries,
    getVehicle,
}