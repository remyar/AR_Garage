const codepostaux = require('./laposte_hexasmal.json');

let database = undefined;

function getDatabase() {
    return database;
}

async function setdbPath(path) {
    return new Promise((resolve, reject) => {
        resolve();
    });
}

async function getAllCodePostaux() {
    return new Promise((resolve, reject) => {
        let result = codepostaux.map((el) => {
            return el.fields;
        })
        resolve(result);
    });
}

module.exports = {
    setdbPath,
    getDatabase,
    getAllCodePostaux
}