const sqlite3 = require('sqlite3').verbose();

let database = undefined;

async function createTables() {
    return new Promise((resolve, reject) => {
        try {
            database.serialize(() => {
                database.run("CREATE TABLE IF NOT EXISTS settings_codePostaux ( id INTEGER PRIMARY KEY , code_postal INTEGER , nom_de_la_commune TEXT )");

                resolve();
            });
        } catch (err) {
            reject(err);
        }
    });
}


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
                    await createTables();
                    resolve();
                }
            } catch (err) {
                reject(err);
            }
        });
    });
}

async function getAllCodePostaux() {
    return new Promise((resolve, reject) => {
        database.serialize(() => {
            database.all("SELECT * FROM settings_codePostaux", (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    });
}

async function saveCodePostal(codePostal) {
    return new Promise(async (resolve, reject) => {
        try {
            let _codePostaux = await getAllCodePostaux();
            let _codePostal = _codePostaux.find((el) => el.id == codePostal.id);
            if (_codePostal == undefined) {
                database.serialize(() => {
                    database.run("INSERT INTO settings_codePostaux ( code_postal , nom_de_la_commune ) VALUES ( ? , ? )", [codePostal.code_postal, codePostal.nom_de_la_commune], function (err) {
                        codePostal.id = this.lastID;
                        resolve(codePostal);
                    });
                });
            }
        } catch (err) {
            reject(err);
        }
    });
}

module.exports = {
    setdbPath,
    getDatabase,
    saveCodePostal,
    getAllCodePostaux
}