const { app, ipcMain } = require('electron');
const code_postaux = require('./code_postaux');
const database = require('./database');
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
            //await database.setdbPath(isDev ? "./assets/database" : "./database");
            await database.setdbPath(isDev ? "./assets/database" : path.join(app.getPath("userData"), "database"));
            // await database.setMainWindows(mainWindow);

            ipcMain.on('OPEN_DEV_TOOLS', (event, value) => {
                if (value) {
                    mainWindow.webContents.openDevTools();
                } else {
                    mainWindow.webContents.closeDevTools();
                }
            });

            Object.keys(code_postaux).forEach((key) => {
                ipcMain.on('code_postaux.' + key, async (event, value) => {
                    event.returnValue = await code_postaux[key](value);
                });
            });

            Object.keys(database).forEach((key) => {
                ipcMain.on('database.' + key, async (event, value) => {
                    event.returnValue = await database[key](value);
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
    }
}