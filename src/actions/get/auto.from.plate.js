import createAction from '../../middleware/actions';
import { PuppeteerWrapper } from '../../utils/puppeteer-wrapper';

export async function getAutoFromPlate(plate = "BB-456-CC", { extra, getState }) {

    async function Sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, ms);
        });
    }

    function rdn(min, max) {
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min)) + min
    }

    async function waitFor(callback) {
        return new Promise((resolve, reject) => {
            let timeout = setTimeout(() => {
                reject();
            }, 5000);
            let interval = setInterval(async () => {
                let val = await callback();
                if (val != undefined) {
                    clearTimeout(timeout);
                    clearInterval(interval);
                    resolve(val);
                }
            }, 100);

        });
    }

    async function opistoGetVehicule(page) {

        let vehicule = {};
        try {

            await waitFor(async () => { return page.$('#identified-vehicle-panel'); });

            let element = await page.$('#identified-vehicle-panel > div > div.col-sm-12 > div.gotham-rounded-medium');
            vehicule.commercial_name = (await page.evaluate(element => element.textContent, element)).split('\n').map((el) => el.trim()).join(' ').trim();
            vehicule.commercial_name = vehicule.commercial_name.split(':')[1]?.trim().replace(/\s{2,}/g, ' ');

            element = await page.$('#breadcrumb > ol > li:nth-child(4) > a > span');
            vehicule.brand = (await page.evaluate(element => element.textContent, element)).replace(/\n/g, '').trim().replace(/\s{2,}/g, ' ');

            element = await page.$('#breadcrumb > ol > li:nth-child(5) > a > span');
            vehicule.model = (await page.evaluate(element => element.textContent, element)).replace(/\n/g, '').trim().replace(/\s{2,}/g, ' ');

            element = await page.$('#identified-vehicle-panel > div > div.col-sm-12 > div.d-flex.flex-column.flex-md-row.gap-2.gap-lg-3 > span:nth-child(1)');
            vehicule.energie = (await page.evaluate(element => element.textContent, element)).replace(/\n/g, '').trim();
            vehicule.energie = vehicule.energie.split(':')[1]?.trim().replace(/\s{2,}/g, ' ');

            element = await page.$('#identified-vehicle-panel > div > div.col-sm-12 > div.d-flex.flex-column.flex-md-row.gap-2.gap-lg-3 > span:nth-child(2)');
            vehicule.engine_code = (await page.evaluate(element => element.textContent, element)).replace(/\n/g, '').trim();
            vehicule.engine_code = vehicule.engine_code.split(':')[1]?.trim().replace(/\s{2,}/g, ' ');

            element = await page.$('#identified-vehicle-panel > div > div.col-sm-12 > div.d-flex.flex-column.flex-md-row.gap-2.gap-lg-3 > span:nth-child(3)');
            vehicule.puissance = (await page.evaluate(element => element.textContent, element)).replace(/\n/g, '').trim();
            vehicule.puissance = vehicule.puissance.split(':')[1]?.trim().replace(/\s{2,}/g, ' ');

            element = await page.$('#identified-vehicle-panel > div > div.col-sm-12 > div.d-flex.flex-column.flex-md-row.gap-2.gap-lg-3 > span:nth-child(4)');
            vehicule.first_batch = (await page.evaluate(element => element.textContent, element)).replace(/\n/g, '').trim();
            vehicule.first_batch = vehicule.first_batch.split(':')[1]?.trim().replace(/\s{2,}/g, ' ');

            vehicule.last_batch = "";

        } catch (ex) {

            console.error(ex.message);
            vehicule = {};
        }

        return vehicule;
    }


    const _puppeteerWrapper = new PuppeteerWrapper({
        logInfo: console.log,
        logError: console.error
    }, { headless: true, width: 1920, height: 1080 });


    try {

        let state = getState();
        let vehicules = state.vehicules;

        let vehicule = vehicules.find((el) => el.plate == plate);
        
        if (!vehicule) {
            await _puppeteerWrapper.setup();

            const page = await _puppeteerWrapper.newPage();
            await page.setViewport({
                width: 1920,
                height: 1080,
            });
            await page.goto('https://www.opisto.fr');

           /* await Sleep(2500);

            await waitFor(async () => { return page.$('#tarteaucitronAlertBig'); });
            const cookie = await waitFor(async () => { return page.$('#tarteaucitronPersonalize2'); });
            cookie.click({ delay: rdn(30, 150) })*/
            const plateInput = await waitFor(async () => { return page.$('#ImmatriculationOpisto'); });
            await page.evaluate(() => document.getElementById("ImmatriculationOpisto").value = "")
            await plateInput.click({ delay: rdn(30, 150) })
            await plateInput.type(plate, { delay: rdn(30, 75) });
            await Sleep(1000);
            await page.click('#btn-home-immat');

            await Sleep(2500);

            if ((await page.$('#immat-warning-message > p'))) {
                throw new Error("Warning message");
            }

            vehicule = await opistoGetVehicule(page);
            vehicule.id = vehicules.length;
            vehicule.plate = plate;
            
            vehicules.push(vehicule);

            await _puppeteerWrapper.cleanup();
            
        } else {
            vehicule.deleted = 0;
        }

        return {
            vehicules: vehicules,
            vehicule: { ...vehicule }
        };
    } catch (err) {
        await _puppeteerWrapper.cleanup();
        throw { message: err.message };
    }
}

export default createAction(getAutoFromPlate);