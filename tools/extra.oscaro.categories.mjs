
import fetch from 'node-fetch';
import { parse } from 'node-html-parser';
import string from "string-sanitizer";
import accents from 'remove-accents';
import fs from 'fs';

let cat = [];

async function _parseCat(_root , parent) {
    return new Promise(async (resolve, reject)=>{
        try{
            let response = await fetch(_root);
            let body = await response.text();
            const root = await parse(body);
            let queryResult = [];

            if ( _root.endsWith('-sc') ){
                //-- sous catégorie
                queryResult = root.querySelectorAll('#categoriesTree .column-nav .link-list > li > a');
            } else{
                queryResult = root.querySelectorAll('#categoriesTree .category-item .category-item-header > h2 > a');
            }
 
            for ( let element of queryResult){

                let link = element.attributes.href;

                let catDirty = element.text.toLowerCase();
                while (catDirty.includes('-') == true) {
                    catDirty = catDirty.replace('-', ' ');
                }
                let catSanitized = accents.remove(string.sanitize.addDash(catDirty));
                while (catSanitized.includes("--") == true) {
                    catSanitized = catSanitized.replace('--', '-');
                }

                console.log(catSanitized);

                let catid = link.split('-')[link.split('-').length - 2];
        /*        let catId = parseInt(link.replace(catSanitized, '')
                    .replace('https://www.oscaro.com/', '')
                    .replace('-c', '')
                    .replace('-sc', '')
                    .replace('-g', '')
                    .replace('-', ''));*/

                let categorie = {
                    id: catid,
                    link: element.attributes.href,
                    name: element.text,
                    parent: parent,
                }

                cat.push(categorie);
                try {
                    if ( categorie.link.endsWith("-g") == false){
                        await _parseCat(categorie.link, categorie.id);
                    }
                } catch (err) {
                    console.log(err);
                }
            }
            resolve();
        }catch(err){
            reject(err);
        }
    });
}

async function _start(){
    try{
        await _parseCat('https://oscaro.com');
        fs.writeFileSync("./tools/oscaroCat.json" , JSON.stringify(cat));
    } catch(err){
        console.log(err);
    }
}

await _start();

