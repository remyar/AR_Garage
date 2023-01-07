
import fetch from 'electron-fetch';

async function get(obj, url) {
    return new Promise(async (resolve, reject) => {

        let headers = {};

        if (obj.headers != undefined) {
            headers = { ...obj.headers };
        }

        try {
            let result = await fetch(url,
                {
                    method: 'GET',
                    useElectronNet: false,
                    headers
                });

            let r = await result.json();

            resolve(r);
        } catch (err) {
            reject(err);
        }
    });
}

async function getVehiclesByKeyNumberPlates(plate) {
    return new Promise(async (resolve, reject) => {
        try{
            const token = await get({},"");
            const response = await get({ headers : {"x-csrf-token" : ""}} , "");





            resolve(response);
        }catch(err){
            reject(err);
        }
    });
}



export default {
    getVehiclesByKeyNumberPlates,
}