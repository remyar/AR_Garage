import createAction from '../../middleware/actions';
import fs from 'fs';
import path from 'path';
export async function readPng(filepath , { extra, getState }) {

    try {
        let data = fs.readFileSync(filepath);

        return {
            fileData : data
        }
    } catch (err) {
        return {
            fileData : undefined
        }
    }
}

export default createAction(readPng);