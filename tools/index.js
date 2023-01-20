const database = require('../src_backend/code_postaux');
const codePostaux = require('./laposte_hexasmal.json')
const cliProgress = require('cli-progress');

// create new container
const multibar = new cliProgress.MultiBar({
    clearOnComplete: false,
    hideCursor: true,
    format: ' {bar} | {value}/{total}',
}, cliProgress.Presets.shades_grey);

async function __app() {
    const b1 = multibar.create(codePostaux.length, 0);
    try {
        await database.setdbPath("./assets/code_postaux.sqlite");

        
        for (let proc of codePostaux) {
            b1.increment();
            await database.saveCodePostal({ code_postal: proc.fields.code_postal, nom_de_la_commune: proc.fields.nom_de_la_commune });
        }

    } catch (err) {
        console.error(err);
    }

    b1.stop();

}

__app();