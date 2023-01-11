const { app, ipcMain } = require('electron');
const database = require('./database');
const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow = undefined;

module.exports = {
    setMainWindows: async (_mainWindow) => {
        mainWindow = _mainWindow;
    },
    start: () => {

        database.setdbPath(isDev ? "./database.sqlite" : path.join(app.getPath("userData"), "database.sqlite"));

        ipcMain.on('OPEN_DEV_TOOLS', (event, value) => {
            if (value) {
                mainWindow.webContents.openDevTools();
            } else {
                mainWindow.webContents.closeDevTools();
            }
        });

        Object.keys(database).forEach((key)=>{
            console.log(key);
            ipcMain.on('database.' + key , async (event , value )=>{
                console.log("cmdkey : " + key);
                event.returnValue = await database[key](value);
            });
        })
    }
}