const { app, ipcMain } = require('electron');
const database = require('./database');
const images = require('./images');
const code_postaux = require('./code_postaux');
const tecdoc = require('./tecdoc');
const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow = undefined;

module.exports = {

    setMainWindows: async (_mainWindow) => {
        mainWindow = _mainWindow;
    },
    start: async () => {
        try{
            await database.setdbPath(isDev ? "./database.sqlite" : path.join(app.getPath("userData"), "database.sqlite"));
            await code_postaux.setdbPath(isDev ? "./assets/code_postaux.sqlite" : path.join(app.getPath("userData") , "code_postaux.sqlite"));
            await tecdoc.setdbPath(isDev ? "./assets/database" : path.join(app.getPath("userData") , "database"));
            await tecdoc.setMainWindows(mainWindow);
            
            ipcMain.on('OPEN_DEV_TOOLS', (event, value) => {
                if (value) {
                    mainWindow.webContents.openDevTools();
                } else {
                    mainWindow.webContents.closeDevTools();
                }
            });

            Object.keys(database).forEach((key)=>{
                ipcMain.on('database.' + key , async (event , value )=>{
                    event.returnValue = await database[key](value);
                });
            });

            Object.keys(tecdoc).forEach((key)=>{
                ipcMain.on('tecdoc.' + key , async (event , value )=>{
                    event.returnValue = await tecdoc[key](value);
                });
            });

            Object.keys(code_postaux).forEach((key)=>{
                ipcMain.on('code_postaux.' + key , async (event , value )=>{
                    event.returnValue = await code_postaux[key](value);
                });
            });


        } catch(err){
            console.error(err);
        }
    }
}