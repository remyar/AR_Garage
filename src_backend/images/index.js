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


async function getImage(id) {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await readFileSync(id);
            result.src=Buffer.from(result.blob).toString('base64')

            resolve([result]);
        } catch (err) {
            resolve([]);
        }
    });
}

module.exports = {
    setdbPath,
    getImage,
}