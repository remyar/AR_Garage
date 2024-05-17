const { app, ipcMain } = require('electron');
const code_postaux = require('./code_postaux');
const database = require('./database');
const technics = require('./technics');
const path = require('path');

const myfetch = require('./fetch');
const images = require('./images');
let isDev = !app.isPackaged;
let mainWindow = undefined;

module.exports = {

    setMainWindows: async (_mainWindow) => {
        mainWindow = _mainWindow;
    },
    start: async () => {
        try {
            await database.setdbPath(isDev ? "./assets/database.zip" : path.join(process.resourcesPath, "database.zip"));
            await technics.setdbPath(isDev ? "./assets/technics.zip" : path.join(process.resourcesPath, "technics.zip"));
            await images.setdbPath(isDev ? "./assets/images.zip" : path.join(process.resourcesPath, "images.zip"));
            //await technics.getMaintenanceByTypeId(22410);

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

            Object.keys(technics).forEach((key) => {
                ipcMain.handle('technics.' + key, async (event, value) => {
                    return await technics[key](value);
                });
            });

            Object.keys(myfetch).forEach((key) => {
                ipcMain.handle('fetch.' + key, async (event, value) => {
                    return (await myfetch[key](value));
                });
            });

            Object.keys(images).forEach((key) => {
                ipcMain.handle('images.' + key, async (event, value) => {
                    return (await images[key](value));
                });
            });

        } catch (err) {
            console.error(err);
        }
    }
}