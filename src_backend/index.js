const { app, ipcMain } = require('electron');
const database = require('./database');
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
            await tecdoc.setdbPath(isDev ? "./assets/tecdoc.sqlite" : path.join(app.getPath("userData") , "tecdoc.sqlite"));

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
                console.log(key);
                ipcMain.on('tecdoc.' + key , async (event , value )=>{
                    console.log("cmdkey : " + key);
                    event.returnValue = await tecdoc[key](value);
                });
            });


        } catch(err){

        }
    }
}