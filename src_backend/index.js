const { app, ipcMain } = require('electron');
const database = require('./database');
const images = require('./images');
const code_postaux = require('./code_postaux');
const tecdoc = require('./tecdoc');
const path = require('path');
const isDev = require('electron-is-dev');
const myfetch = require('./fetch');

let mainWindow = undefined;

module.exports = {

    setMainWindows: async (_mainWindow) => {
        mainWindow = _mainWindow;
    },
    start: async () => {
        try {
            await database.setdbPath(isDev ? "./assets/database.sqlite" : path.join(app.getPath("userData"), "database.sqlite"));
            await tecdoc.setdbPath(isDev ? "./assets/database" : path.join(app.getPath("userData"), "database"));
            await tecdoc.setMainWindows(mainWindow);

            ipcMain.on('OPEN_DEV_TOOLS', (event, value) => {
                if (value) {
                    mainWindow.webContents.openDevTools();
                } else {
                    mainWindow.webContents.closeDevTools();
                }
            });

            Object.keys(database).forEach((key) => {
                ipcMain.on('database.' + key, async (event, value) => {
                    event.returnValue = await database[key](value);
                });
            });

            Object.keys(tecdoc).forEach((key) => {
                ipcMain.on('tecdoc.' + key, async (event, value) => {
                    event.returnValue = await tecdoc[key](value);
                });
            });

            Object.keys(code_postaux).forEach((key) => {
                ipcMain.on('code_postaux.' + key, async (event, value) => {
                    event.returnValue = await code_postaux[key](value);
                });
            });

            Object.keys(myfetch).forEach((key) => {
                ipcMain.on('fetch.' + key, async (event, value) => {
                    event.returnValue = await myfetch[key](value);
                });
            });


        } catch (err) {
            console.error(err);
        }

        try{
/* 
           let resp = await fetch("https://www.mister-auto.com/nwsAjax/Plate?immatriculation=ax341ev");
            console.log(await resp.json());
*/
            let re = await fetch("https://www.goodrace.fr/download/tecdoc_database.json");
            let obj = await re.json();
            await database.updateTecDocInformations(obj);
        }
        catch (err) {
            console.error(err);
        }
    }
}