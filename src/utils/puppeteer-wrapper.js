import puppeteer from 'puppeteer-core';
import fs from 'fs';

/** 
 * chromePath:  the path of the chrome executable in our pc
 * setup() :    initialize Puppeteer
 * cleanup():   clearnup Puppeteer
 * browser:     global Puppeteer browser instance
 * newPage():   get new page with default user agent and dimensions
 */

 /**
  * options: {headless, width, height}
  */
export class PuppeteerWrapper {
    constructor(logger, options) {
        this._logger = logger;
        this._options = options || { headless: true };

        // Public
        this.chromePath = undefined;
        this.browser = undefined;
    }

    async setup() {
        const isChromePathSet = await this._setChromePath();
        if (!isChromePathSet) {
            return false;
        }

        const args = [];
        if (this._options.width) {
            args.push(`--window-size=${this._options.width},${this._options.height}`);
        }

        this._logger.logInfo("Setting up puppeteer...");
        this.browser = await puppeteer.launch({
            headless: this._options.headless,
            executablePath: this.chromePath,
            args
        });
        this._logger.logInfo("Puppeteer initialized");
        return true;
    }

    async cleanup() {
        if (this.browser) await this.browser.close();
    }

    async newPage() {
        const page = await this.browser.newPage();
        page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36');

      /*  if (this._options.width) {
            await page._client.send('Emulation.clearDeviceMetricsOverride');
        }*/
        return page;
    }

    async _setChromePath() {

        // Try the default path
        this.chromePath = this._getDefaultOsPath();
        if (!fs.existsSync(this.chromePath)) {
            this._logger.logError(`Default chrome path does not exists: ${this.chromePath}`);
            return false;
        }

        return true;
    }

    _getDefaultOsPath() {
        let pathToReturn = "";
        const listPathToTest = [
            'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
            'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
        ]
        
        listPathToTest.forEach((el)=>{
            if (pathToReturn == "" &&  fs.existsSync(el)){
                pathToReturn = el;
            }
        });

        return pathToReturn;

      
    }
}