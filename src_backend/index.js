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

        ipcMain.on('database.getAllFactures', async (event, value) => {
            let result = await database.getAllFactures();
            event.returnValue = result;
        });

        ipcMain.on('database.saveEntrepriseSettings', async (event, value) => {
            let result = await database.saveEntrepriseSettings(value);
            event.returnValue = result;
        });

        ipcMain.on('database.getEntrepriseSettings', async (event, value) => {
            let result = await database.getEntrepriseSettings();
            event.returnValue = result;
        });

        ipcMain.on('database.savePaiementSettings', async (event, value) => {
            let result = await database.savePaiementSettings(value);
            event.returnValue = result;
        });

        ipcMain.on('database.getPaiementSettings', async (event, value) => {
            let result = await database.getPaiementSettings();
            event.returnValue = result;
        });

        ipcMain.on('database.saveLogoSettings', async (event, value) => {
            let result = await database.saveLogoSettings(value);
            event.returnValue = result;
        });

        ipcMain.on('database.getLogoSettings', async (event, value) => {
            let result = await database.getLogoSettings();
            event.returnValue = result;
        });
       
        ipcMain.on('database.saveGeneralSettings', async (event, value) => {
            let result = await database.saveGeneralSettings(value);
            event.returnValue = result;
        });

        ipcMain.on('database.getGeneralSettings', async (event, value) => {
            let result = await database.getGeneralSettings();
            event.returnValue = result;
        });


        ipcMain.on('database.getAllClients', async (event, value) => {
            let result = await database.getAllClients();
            event.returnValue = result;
        });
        ipcMain.on('database.getClientById', async (event, value) => {
            let result = await database.getClientById(value);
            event.returnValue = result;
        });
        ipcMain.on('database.saveClient', async (event, value) => {
            let result = await database.saveClient(value);
            event.returnValue = result;
        });

        ipcMain.on('database.getClient', async (event, value) => {
            let result = await database.getClient(value);
            event.returnValue = result;
        });

        ipcMain.on('database.getVehiculeFromPlate', async (event, value) => {
            let result = await database.getVehiculeFromPlate(value);
            event.returnValue = result;
        });
        ipcMain.on('database.getVehiculeById', async (event, value) => {
            let result = await database.getVehiculeById(value);
            event.returnValue = result;
        });
        ipcMain.on('database.saveVehicule', async (event, value) => {
            let result = await database.saveVehicule(value);
            event.returnValue = result;
        });

        ipcMain.on('database.getAllVehicules', async (event, value) => {
            let result = await database.getAllVehicules();
            event.returnValue = result;
        });

        ipcMain.on('database.getAlldevis', async (event, value) => {
            let result = await database.getAllDevis();
            event.returnValue = result;
        });

        ipcMain.on('database.getDeviById', async (event, value) => {
            let result = await database.getDeviById(value);
            event.returnValue = result;
        });

        ipcMain.on('database.saveDevi', async (event, value) => {
            let result = await database.saveDevi(value);
            event.returnValue = result;
        });

        ipcMain.on('database.getAllCategories', async (event, value) => {
            let result = await database.getAllCategories();
            event.returnValue = result;
        });

        ipcMain.on('database.saveCategorie', async (event, value) => {
            let result = await database.saveCategorie(value);
            event.returnValue = result;
        });

    }
}