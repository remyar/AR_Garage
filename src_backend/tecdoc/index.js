const sqlite3 = require('sqlite3').verbose();

let database = undefined;

function getDatabase() {
    return database;
}

async function setdbPath(path , options) {
    return new Promise((resolve, reject) => {
        database = new sqlite3.Database(path, sqlite3.OPEN_READONLY , async (err) => {
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

async function getVehiculeByCarId(carId){
    return new Promise((resolve, reject) => {
        database.serialize(() => {
            database.all("SELECT * FROM Vehicle WHERE carId=?",[carId], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    });
}

async function getAssemblyGroupFacets(carId){
    return new Promise((resolve, reject) => {
        database.serialize(() => {
            database.all("SELECT * FROM AssemblyGroupFacets WHERE carId=?",[carId], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }); 
}

async function getArticleIdsWithState(args){
    return new Promise((resolve, reject) => {
        database.serialize(() => {
            database.all("SELECT * FROM Articles WHERE carId=? AND assemblyGroupNodeId=?",[args.carId , args.assemblyGroupNodeId], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    });
}


async function getArticleLinkIds(articleLinkId){
    return new Promise((resolve, reject) => {
        database.serialize(() => {
            database.all("SELECT * FROM ArticleLinkId WHERE articleLinkId=?",[articleLinkId], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    });
}

async function getArticleDocuments(documentId){
    return new Promise((resolve, reject) => {
        database.serialize(() => {
            database.all("SELECT * FROM ArticleDocuments WHERE docId=?",[documentId], (err, row) => {
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

    getVehiculeByCarId,
    getAssemblyGroupFacets,
    getArticleIdsWithState,
    getArticleLinkIds,
    getArticleDocuments
}