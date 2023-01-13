let db = require('../src_backend/database')
const fs = require('fs');


let json = fs.readFileSync('./tools/oscaroCat.json');

async function _process(){
    await db.setdbPath("./database.sqlite");

    let cats = JSON.parse(json);
    for ( let cat of cats){
        console.log(cat);
        try{
            await db.importCategorie({ id : cat.id , nom : cat.name , parent_id : cat.parent})
        } catch(err){
            console.log(err);
        }
    }
}

_process();
