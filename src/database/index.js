
const databasename = "library";
const databaseVersion = 4;

let db;

async function start() {
    return new Promise((resolve, reject) => {
        // Check for support.
        if (!('indexedDB' in window)) {
            console.log("This browser doesn't support IndexedDB.");
            return;
        }

        const request = indexedDB.open(databasename, databaseVersion);

        request.onupgradeneeded = function () {
            // The database did not previously exist, so create object stores and indexes.
            db = request.result;
            if (db.objectStoreNames.contains("vehicules") == false) {
                db.createObjectStore("vehicules", { keyPath: "id", autoIncrement: true });
            }
            if (db.objectStoreNames.contains("produits") == false) {
                db.createObjectStore("produits", { keyPath: "id", autoIncrement: true });
            }
            if (db.objectStoreNames.contains("services") == false) {
                db.createObjectStore("services", { keyPath: "id", autoIncrement: true });
            }
            if (db.objectStoreNames.contains("clients") == false) {
                db.createObjectStore("clients", { keyPath: "id", autoIncrement: true });
            }
            if (db.objectStoreNames.contains("devis") == false) {
                db.createObjectStore("devis", { keyPath: "id", autoIncrement: true });
            }
            if (db.objectStoreNames.contains("factures") == false) {
                db.createObjectStore("factures", { keyPath: "id", autoIncrement: true });
            }
            if (db.objectStoreNames.contains("settings") == false) {
                db.createObjectStore("settings", { keyPath: "id" });
            }
            if (db.objectStoreNames.contains("version") == false) {
                db.createObjectStore("version", { keyPath: "id" });
            }
        };

        request.onerror = function (err) {
            console.error(err);
            reject(err);
        };

        request.onsuccess = function () {
            db = request.result;
            resolve(db);
        };
    });
}

async function deleteDB() {
    return new Promise((resolve, reject) => {

        db.close();

        var req = indexedDB.deleteDatabase(databasename);
        req.onsuccess = function () {
            console.log("Deleted database successfully");
            resolve("Deleted database successfully");
        };
        req.onerror = function () {
            console.log("Couldn't delete database");
            reject("Couldn't delete database");
        };
        req.onblocked = function () {
            console.log("Couldn't delete database due to the operation being blocked");
            reject("Couldn't delete database due to the operation being blocked");
        };
    });
}

async function dump() {
    return new Promise(async (resolve, reject) => {
        try {
            let settings = await getSettings();
            let clients = await getAllClients();
            let vehicules = await getAllVehicules();
            let produits = await getAllProducts();
            let services = await getAllServices();
            let devis = await getAllDevis();
            let factures = await getAllFactures();
            resolve({ settings, clients, vehicules, produits, services, devis, factures });
        } catch (err) {

        }
    });
}

async function restore(datas) {

    return new Promise(async (resolve, reject) => {

        try {
            await deleteDB();
            await start();

            if (datas.settings && datas.settings.length > 0) {
                await saveSettings(datas.settings[0]);
            }
            else if ( datas.settings){
                await saveSettings(datas.settings);
            }

            if (datas.clients && datas.clients.length > 0) {
                for (let client of datas.clients) {
                    await saveClient(client);
                }
            }

            if (datas.vehicules && datas.vehicules.length > 0) {
                for (let vehicule of datas.vehicules) {
                    await saveVehicule(vehicule);
                }
            }

            if (datas.products && datas.products.length > 0) {
                for (let produit of datas.products) {
                    await saveProduct(produit);
                }
            }
            if (datas.produits && datas.produits.length > 0) {
                for (let produit of datas.produits) {
                    await saveProduct(produit);
                }
            }

            if (datas.services && datas.services.length > 0) {
                for (let service of datas.services) {
                    await saveService(service);
                }
            }

            if (datas.devis && datas.devis.length > 0) {
                for (let devis of datas.devis) {
                    await saveDevis(devis);
                }
            }

            if (datas.factures && datas.factures.length > 0) {
                for (let facture of datas.factures) {
                    await saveFacture(facture);
                }
            }

            if (datas.version && datas.version.length > 0) {
                await saveVersion(datas.version[0]);
            }

            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

async function getVersion() {
    return new Promise(async (resolve, reject) => {
        try {
            let transaction = db.transaction('version', 'readwrite');
            let settings_general = transaction.objectStore('version');

            let settings = settings_general.get(1);
            settings.onsuccess = function () {
                resolve(settings.result);
            };

            settings.onerror = function () {
                reject(settings.error);
            };
        } catch (err) {
            reject(err.message);
        }
    })

}

async function saveVersion(_data) {
    return new Promise(async (resolve, reject) => {
        try {
            let transaction = db.transaction('version', 'readwrite');

            transaction.oncomplete = function () {
                resolve(_data);
            };

            let settings_general = transaction.objectStore('version');

            let __data = {
                id: 1,
                ..._data
            }

            settings_general.put(__data);

        } catch (err) {
            reject(err.message);
        }
    });
}

async function saveSettings(_settings) {
    return new Promise(async (resolve, reject) => {
        try {
            let transaction = db.transaction('settings', 'readwrite');

            transaction.oncomplete = function () {
                resolve(_settings);
            };

            let settings_general = transaction.objectStore('settings');

            let settings = {
                id: 1,
                ..._settings
            }

            settings_general.put(settings);
        } catch (err) {
            reject(err.message);
        }
    })

}

async function getSettings() {
    return new Promise(async (resolve, reject) => {
        try {
            let transaction = db.transaction('settings', 'readwrite');
            let settings_general = transaction.objectStore('settings');

            let settings = settings_general.get(1);
            settings.onsuccess = function () {
                resolve(settings.result);
            };

            settings.onerror = function () {
                reject(settings.error);
            };
        } catch (err) {
            reject();
        }
    })

}

async function getAllClients() {
    return new Promise(async (resolve, reject) => {
        try {
            let transaction = db.transaction('clients', 'readwrite');
            let _clients = transaction.objectStore('clients');

            let clients = _clients.getAll();
            clients.onsuccess = function () {
                resolve(clients.result);
            };

            clients.onerror = function () {
                reject(clients.error);
            };
        } catch (err) {
            reject();
        }
    })

}

async function saveClient(_client) {
    return new Promise(async (resolve, reject) => {
        try {
            let transaction = db.transaction('clients', 'readwrite');

            transaction.oncomplete = function (event) {
                resolve(_client);
            };

            let result = transaction.objectStore('clients');

            const updateRequest = result.put({ ..._client });
            updateRequest.onsuccess = () => {
                _client.id = updateRequest.result
            }
        } catch (err) {
            reject();
        }
    })

}

async function getClientById(id) {
    return new Promise(async (resolve, reject) => {
        try {
            let transaction = db.transaction('clients', 'readwrite');
            let request = transaction.objectStore('clients');

            let result = request.get(parseInt(id.toString()));
            result.onsuccess = function () {
                resolve(result.result);
            };

            result.onerror = function () {
                reject(result.error);
            };
        } catch (err) {
            reject();
        }
    })

}

async function getAllVehicules() {
    return new Promise(async (resolve, reject) => {
        try {
            let transaction = db.transaction('vehicules', 'readwrite');
            let request = transaction.objectStore('vehicules');

            let result = request.getAll();
            result.onsuccess = function () {
                resolve(result.result);
            };

            result.onerror = function () {
                reject(result.error);
            };
        } catch (err) {
            reject();
        }
    })

}

async function getVehiculeByPlate(plate) {
    return new Promise(async (resolve, reject) => {
        try {
            let transaction = db.transaction('vehicules', 'readwrite');
            let request = transaction.objectStore('vehicules');

            let result = request.getAll();
            result.onsuccess = function () {
                let r = result.result.filter((el) => el.plate == plate);
                resolve(r[0] || {});
            };

            result.onerror = function () {
                reject(result.error);
            };
        } catch (err) {
            reject();
        }
    })
}

async function getVehiculeById(id) {
    return new Promise(async (resolve, reject) => {
        try {
            let transaction = db.transaction('vehicules', 'readwrite');
            let request = transaction.objectStore('vehicules');

            let result = request.get(parseInt(id.toString()));
            result.onsuccess = function () {
                resolve(result.result);
            };

            result.onerror = function () {
                reject(result.error);
            };
        } catch (err) {
            reject();
        }
    })

}

async function saveVehicule(_data) {
    return new Promise(async (resolve, reject) => {
        try {
            let transaction = db.transaction('vehicules', 'readwrite');

            transaction.oncomplete = function () {
                resolve(_data);
            };

            let result = transaction.objectStore('vehicules');

            const updateRequest = result.put({ ..._data });
            updateRequest.onsuccess = () => {
                _data.id = updateRequest.result
            }

        } catch (err) {
            reject();
        }
    })

}

async function getAllProducts() {
    return new Promise(async (resolve, reject) => {
        try {
            let transaction = db.transaction('produits', 'readwrite');
            let request = transaction.objectStore('produits');

            let result = request.getAll();
            result.onsuccess = function () {
                resolve(result.result);
            };

            result.onerror = function () {
                reject(result.error);
            };
        } catch (err) {
            reject();
        }
    })

}

async function getProductById(id) {
    return new Promise(async (resolve, reject) => {
        try {
            let transaction = db.transaction('produits', 'readwrite');
            let request = transaction.objectStore('produits');

            let result = request.get(parseInt(id.toString()));
            result.onsuccess = function () {
                resolve(result.result);
            };

            result.onerror = function () {
                reject(result.error);
            };
        } catch (err) {
            reject();
        }
    })

}

async function saveProduct(_data) {
    return new Promise(async (resolve, reject) => {
        try {
            let transaction = db.transaction('produits', 'readwrite');

            transaction.oncomplete = function () {
                resolve(_data);
            };

            let result = transaction.objectStore('produits');

            const updateRequest = result.put({ ..._data });
            updateRequest.onsuccess = () => {
                _data.id = updateRequest.result
            }
        } catch (err) {
            reject();
        }
    })

}

async function getAllServices() {
    return new Promise(async (resolve, reject) => {
        try {
            let transaction = db.transaction('services', 'readwrite');
            let request = transaction.objectStore('services');

            let result = request.getAll();
            result.onsuccess = function () {
                resolve(result.result);
            };

            result.onerror = function () {
                reject(result.error);
            };
        } catch (err) {
            reject();
        }
    })

}

async function getServiceById(id) {
    return new Promise(async (resolve, reject) => {
        try {
            let transaction = db.transaction('services', 'readwrite');
            let request = transaction.objectStore('services');

            let result = request.get(parseInt(id.toString()));
            result.onsuccess = function () {
                resolve(result.result);
            };

            result.onerror = function () {
                reject(result.error);
            };
        } catch (err) {
            reject();
        }
    })

}

async function saveService(_data) {
    return new Promise(async (resolve, reject) => {
        try {
            let transaction = db.transaction('services', 'readwrite');

            transaction.oncomplete = function () {
                resolve(_data);
            };

            let result = transaction.objectStore('services');

            const updateRequest = result.put({ ..._data });
            updateRequest.onsuccess = () => {
                _data.id = updateRequest.result
            }
        } catch (err) {
            reject();
        }
    })

}

async function getAllDevis() {
    return new Promise(async (resolve, reject) => {
        try {
            let transaction = db.transaction('devis', 'readwrite');
            let request = transaction.objectStore('devis');

            let result = request.getAll();
            result.onsuccess = function () {
                resolve(result.result);
            };

            result.onerror = function () {
                reject(result.error);
            };
        } catch (err) {
            reject();
        }
    })

}

async function getDevisById(id) {
    return new Promise(async (resolve, reject) => {
        try {
            let transaction = db.transaction('devis', 'readwrite');
            let request = transaction.objectStore('devis');

            let result = request.get(parseInt(id.toString()));
            result.onsuccess = function () {
                resolve(result.result);
            };

            result.onerror = function () {
                reject(result.error);
            };
        } catch (err) {
            reject();
        }
    })

}

async function saveDevis(_data) {
    return new Promise(async (resolve, reject) => {
        try {
            let transaction = db.transaction('devis', 'readwrite');

            transaction.oncomplete = function () {
                resolve(_data);
            };

            let result = transaction.objectStore('devis');

            const updateRequest = result.put({ ..._data });
            updateRequest.onsuccess = () => {
                _data.id = updateRequest.result
            }
        } catch (err) {
            reject();
        }
    })

}


async function getAllFactures() {
    return new Promise(async (resolve, reject) => {
        try {
            let transaction = db.transaction('factures', 'readwrite');
            let request = transaction.objectStore('factures');

            let result = request.getAll();
            result.onsuccess = function () {
                resolve(result.result);
            };

            result.onerror = function () {
                reject(result.error);
            };
        } catch (err) {
            reject();
        }
    })

}

async function getFactureById(id) {
    return new Promise(async (resolve, reject) => {
        try {
            let transaction = db.transaction('factures', 'readwrite');
            let request = transaction.objectStore('factures');

            let result = request.get(parseInt(id.toString()));
            result.onsuccess = function () {
                resolve(result.result);
            };

            result.onerror = function () {
                reject(result.error);
            };
        } catch (err) {
            reject();
        }
    })

}

async function saveFacture(_data) {
    return new Promise(async (resolve, reject) => {
        try {
            let transaction = db.transaction('factures', 'readwrite');

            transaction.oncomplete = function () {
                resolve(_data);
            };

            let result = transaction.objectStore('factures');

            const updateRequest = result.put({ ..._data });
            updateRequest.onsuccess = () => {
                _data.id = updateRequest.result
            }
        } catch (err) {
            reject();
        }
    })

}

module.exports = {
    start,
    dump,
    restore,

    getVersion,
    saveVersion,

    getSettings,
    saveSettings,

    getAllClients,
    getClientById,
    saveClient,

    getAllVehicules,
    getVehiculeByPlate,
    getVehiculeById,
    saveVehicule,

    getAllProducts,
    getProductById,
    saveProduct,

    getAllServices,
    getServiceById,
    saveService,

    getAllDevis,
    getDevisById,
    saveDevis,

    getAllFactures,
    getFactureById,
    saveFacture,
}