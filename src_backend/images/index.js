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

async function getDocument(docId){
    return new Promise((resolve, reject) => {
        database.serialize(() => {
            database.all("SELECT * FROM images WHERE docId=?",[docId], (err, row) => {
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

    getDocument
}