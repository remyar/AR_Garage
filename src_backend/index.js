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
            await database.setdbPath(isDev ? "./assets/database.zip" : path.join(process.resourcesPath, "database.zip"));

            ipcMain.handle('OPEN_DEV_TOOLS', (event, value) => {
                if (value) {
                    mainWindow.webContents.openDevTools();
                } else {
                    mainWindow.webContents.closeDevTools();
                }
            });

            Object.keys(code_postaux).forEach((key) => {
                ipcMain.handle('code_postaux.' + key, async (event, value) => {
                    return (await code_postaux[key](value));
                });
            });

            Object.keys(database).forEach((key) => {
                ipcMain.handle('database.' + key, async (event, value) => {
                    return (await database[key](value));
                });
            });

            Object.keys(myfetch).forEach((key) => {
                ipcMain.handle('fetch.' + key, async (event, value) => {
                    return (await myfetch[key](value));
                });
            });
        } catch (err) {
            console.error(err);
        }
    }
}