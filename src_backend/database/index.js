const sqlite3 = require('sqlite3');

let database = undefined;

async function createTables() {
    return new Promise((resolve, reject) => {
        database.serialize(() => {
            database.run("CREATE TABLE IF NOT EXISTS devis ( id INTEGER PRIMARY KEY , client_id INTEGER, vehicule_id INTEGER , date INTEGER , expiration INTEGER)");
            database.run("CREATE TABLE IF NOT EXISTS devis_produits ( id INTEGER PRIMARY KEY , devis_id INTEGER, produit_id INTEGER , quantite INTEGER)");
            database.run("CREATE TABLE IF NOT EXISTS factures ( id INTEGER PRIMARY KEY , client_id INTEGER, vehicule_id INTEGER)");
            database.run("CREATE TABLE IF NOT EXISTS settings_entreprise ( id INTEGER PRIMARY KEY , nom TEXT, adresse1 TEXT , adresse2 TEXT , code_postal TEXT , ville TEXT , email TEXT, siret TEXT , telephone TEXT , rcs TEXT)");
            database.run("CREATE TABLE IF NOT EXISTS settings_paiement ( id INTEGER PRIMARY KEY , nom TEXT, iban TEXT , _order TEXT)");
            database.run("CREATE TABLE IF NOT EXISTS settings_logo ( id INTEGER PRIMARY KEY , logo TEXT)");
            database.run("CREATE TABLE IF NOT EXISTS settings_general ( id INTEGER PRIMARY KEY , wizard INTEGER)");
            database.run("CREATE TABLE IF NOT EXISTS clients ( id INTEGER PRIMARY KEY , nom TEXT , prenom TEXT , adresse1 TEXT , adresse2 TEXT , code_postal TEXT , ville TEXT , email TEXT , telephone TEXT)");
            database.run("CREATE TABLE IF NOT EXISTS vehicules ( id INTEGER PRIMARY KEY , oscaroId INTEGER,brand TEXT , model TEXT , puissance TEXT , phase TEXT , designation TEXT , engineCode TEXT , gearboxCode TEXT , immatriculationDate TEXT, vin TEXT, energy TEXT, plate TEXT)");
            database.run("CREATE TABLE IF NOT EXISTS produits ( id INTEGER PRIMARY KEY , nom TEXT , marque TEXT , ref_fab TEXT , ref_oem TEXT , categorie_id INTEGER , subcategorie_id INTEGER , prix_achat REAL , prix_vente REAL)");
            database.run("CREATE TABLE IF NOT EXISTS categories ( id INTEGER PRIMARY KEY , nom TEXT , parent_id )");
            resolve();
        });
    });
}

async function setdbPath(path) {
    return new Promise((resolve, reject) => {
        database = new sqlite3.Database(path, async (err) => {
            try {
                if (err) {
                    reject("unable to create database");
                } else {
                    await createTables();
                    resolve();
                }
            } catch (err) {
                reject("unable to create database");
            }
        });
    });
}

async function getAllFactures() {
    return new Promise((resolve, reject) => {
        database.serialize(() => {
            database.all("SELECT * FROM factures", (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row || []);
                }
            });
        });
    });
}

async function getEntrepriseSettings() {
    return new Promise((resolve, reject) => {
        database.serialize(() => {
            database.all("SELECT * FROM settings_entreprise", (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row[0]);
                }
            });
        });
    });
}

async function saveEntrepriseSettings(settings) {
    return new Promise(async (resolve, reject) => {
        try {
            let settingsEntreprise = await getEntrepriseSettings();
            if (settingsEntreprise == undefined) {
                //-- insert
                database.serialize(() => {
                    database.run("INSERT INTO settings_entreprise (nom , adresse1 , adresse2 , code_postal , ville , email , siret , telephone , rcs ) VALUES (?,?,?,?,?,?,?,?,?)",
                        [
                            settings.nom,
                            settings.adresse1,
                            settings.adresse2,
                            settings.code_postal,
                            settings.ville,
                            settings.email,
                            settings.siret,
                            settings.telephone,
                            settings.rcs,
                        ]);
                });
            } else {
                //-- update
                database.serialize(() => {
                    database.run("UPDATE settings_entreprise SET nom=?,adresse1=?,adresse2=?,code_postal=?,ville=?,email=?,siret=?,telephone=?,rcs=? WHERE id=?", [
                        settings.nom,
                        settings.adresse1,
                        settings.adresse2,
                        settings.code_postal,
                        settings.ville,
                        settings.email,
                        settings.siret,
                        settings.telephone,
                        settings.rcs,
                        settingsEntreprise.id
                    ]);
                });
            }

            resolve(settings);
        } catch (err) {
            reject(err);
        }
    });
}

async function getPaiementSettings() {
    return new Promise((resolve, reject) => {
        database.serialize(() => {
            database.all("SELECT * FROM settings_paiement", (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    let format = row[0];
                    if (format) {
                        format.order = format._order;
                        delete format._order;
                    }
                    resolve(format);
                }
            });
        });
    });
}

async function savePaiementSettings(settings) {
    return new Promise(async (resolve, reject) => {
        try {
            let settingsPaiement = await getPaiementSettings();
            if (settingsPaiement == undefined) {
                //-- insert
                database.serialize(() => {
                    database.run("INSERT INTO settings_paiement (nom , iban , _order ) VALUES (?,?,?)",
                        [
                            settings.nom,
                            settings.iban,
                            settings.order,
                        ]);
                });
            } else {
                //-- update
                database.serialize(() => {
                    database.run("UPDATE settings_paiement SET nom=?,iban=?,_order=? WHERE id=?", [
                        settings.nom,
                        settings.iban,
                        settings.order,
                        settingsPaiement.id
                    ]);
                });
            }

            resolve(settings);
        } catch (err) {
            reject(err);
        }
    });
}

async function getLogoSettings() {
    return new Promise((resolve, reject) => {
        database.serialize(() => {
            database.all("SELECT * FROM settings_logo", (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row[0]);
                }
            });
        });
    });
}

async function saveLogoSettings(settings) {
    return new Promise(async (resolve, reject) => {
        try {
            let settingsLogo = await getLogoSettings();
            if (settingsLogo == undefined) {
                //-- insert
                database.serialize(() => {
                    database.run("INSERT INTO settings_logo (logo ) VALUES (?)",
                        [
                            settings
                        ]);
                });
            } else {
                //-- update
                database.serialize(() => {
                    database.run("UPDATE settings_logo SET logo=? WHERE id=?", [
                        settings,
                        settingsLogo.id
                    ]);
                });
            }

            resolve(settings);
        } catch (err) {
            reject(err);
        }
    });
}

async function getGeneralSettings() {
    return new Promise((resolve, reject) => {
        database.serialize(() => {
            database.all("SELECT * FROM settings_general", (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    let format = row[0];
                    if (format) {
                        format.wizard == true ? 1 : 0
                    }
                    resolve(format);
                }
            });
        });
    });
}

async function saveGeneralSettings(settings) {
    return new Promise(async (resolve, reject) => {
        try {
            let settingsGeneral = await getGeneralSettings();
            if (settingsGeneral == undefined) {
                //-- insert
                database.serialize(() => {
                    database.run("INSERT INTO settings_general ( wizard ) VALUES (?)",
                        [
                            settings.wizard == true ? 1 : 0
                        ]);
                });
            } else {
                //-- update
                database.serialize(() => {
                    database.run("UPDATE settings_general SET wizard=? WHERE id=?", [
                        settings.wizard == true ? 1 : 0,
                        settingsGeneral.id
                    ]);
                });
            }

            resolve(settings);
        } catch (err) {
            reject(err);
        }
    });
}

async function getAllClients() {
    return new Promise((resolve, reject) => {
        database.serialize(() => {
            database.all("SELECT * FROM clients", (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    });
}

async function getClientById(id) {
    return new Promise((resolve, reject) => {
        database.serialize(() => {
            database.all("SELECT * FROM clients WHERE id LIKE ?", [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row[0]);
                }
            });
        });
    });
}

async function saveClient(client) {
    return new Promise(async (resolve, reject) => {
        try {
            let clients = await getAllClients();
            let _client = clients.find((el) => el.id == client.id);
            if (_client == undefined) {
                //-- insert
                database.serialize(() => {
                    database.run("INSERT INTO clients ( nom , prenom , adresse1 , adresse2 , code_postal , ville , email , telephone) VALUES (?,?,?,?,?,?,?,?)",
                        [
                            client.nom,
                            client.prenom,
                            client.adresse1,
                            client.adresse2,
                            client.code_postal,
                            client.ville,
                            client.email,
                            client.telephone
                        ]);
                });
            } else {
                //-- update
                database.serialize(() => {
                    database.run("UPDATE clients SET nom=?,prenom=?,adresse1=?,adresse2=?,code_postal=?,ville=?,email=?,telephone=? WHERE id=?", [
                        client.nom,
                        client.prenom,
                        client.adresse1,
                        client.adresse2,
                        client.code_postal,
                        client.ville,
                        client.email,
                        client.telephone,
                        _client.id
                    ]);
                });
            }

            resolve(client);
        } catch (err) {
            reject(err);
        }
    });
}

async function getVehiculeFromPlate(plate) {
    return new Promise((resolve, reject) => {
        database.serialize(() => {
            database.all("SELECT * FROM vehicules WHERE plate LIKE ?", [plate], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row[0]);
                }
            });
        });
    });
}

async function getVehiculeById(id) {
    return new Promise((resolve, reject) => {
        database.serialize(() => {
            database.all("SELECT * FROM vehicules WHERE id LIKE ?", [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row[0]);
                }
            });
        });
    });
}

async function saveVehicule(vehicule) {
    return new Promise(async (resolve, reject) => {
        try {
            let _vehicule = await getVehiculeFromPlate(vehicule.plate);
            if (_vehicule == undefined) {
                //-- insert
                database.serialize(() => {
                    database.run("INSERT INTO vehicules ( oscaroId , brand , model , puissance , phase , designation , engineCode , gearboxCode , immatriculationDate ,vin ,energy, plate ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
                        [
                            vehicule.oscaroId,
                            vehicule.brand,
                            vehicule.model,
                            vehicule.puissance,
                            vehicule.phase,
                            vehicule.designation,
                            vehicule.engineCode,
                            vehicule.gearboxCode,
                            vehicule.immatriculationDate,
                            vehicule.vin,
                            vehicule.energy,
                            vehicule.plate
                        ]);
                });

            } else {
                database.serialize(() => {
                    database.run("INSERT UPDATE vehicules SET oscaroId=? , brand=? , model=? , puissance=? , phase=? , designation=? , engineCode=? , gearboxCode=? , immatriculationDate=? ,vin=? ,energy=?, plate=? WHERE id=?",
                        [
                            vehicule.oscaroId,
                            vehicule.brand,
                            vehicule.model,
                            vehicule.puissance,
                            vehicule.phase,
                            vehicule.designation,
                            vehicule.engineCode,
                            vehicule.gearboxCode,
                            vehicule.immatriculationDate,
                            vehicule.vin,
                            vehicule.energy,
                            vehicule.plate,
                            _vehicule.id
                        ]);
                });
            }

            resolve(_vehicule);
        } catch (err) {
            reject(err);
        }
    });
}

async function getAllVehicules() {
    return new Promise((resolve, reject) => {
        database.serialize(() => {
            database.all("SELECT * FROM vehicules", (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    });
}

async function getAllDevis() {
    return new Promise((resolve, reject) => {
        database.serialize(() => {
            database.all("SELECT * FROM devis", (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    });
}

async function getDeviById(id) {
    return new Promise((resolve, reject) => {
        database.serialize(() => {
            database.all("SELECT * FROM devis WHERE id LIKE ?", [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row[0] || {});
                }
            });
        });
    });
}

async function saveDevi(devi) {
    return new Promise(async (resolve, reject) => {
        try {
            let _devis = await getAllDevis();
            let _devi = _devis.find((el) => el.id == devi.id);
            if (_devi == undefined) {
                //-- insert
                database.serialize(() => {
                    database.run("INSERT INTO devis ( client_id , vehicule_id , date , expiration) VALUES ( ? , ? , ? , ?)", [devi.client_id, devi.vehicule_id, devi.date, devi.expiration], function (err) {
                        if (err) {
                            reject(err);
                        } else {
                            devi.id = this.lastID;
                            resolve(devi);
                        }
                    });
                });
            } else {
                //-- update
            }
        } catch (err) {
            reject(err);
        }
    });
}

async function getAllCategories() {
    return new Promise((resolve, reject) => {
        database.serialize(() => {
            database.all("SELECT * FROM categories", (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    });
}

async function saveCategorie(categorie) {
    return new Promise(async (resolve, reject) => {
        try {
            let _categories = await getAllCategories();
            let _categorie = _categories.find((el) => el.id == categorie.id);
            if (_categorie == undefined) {
                database.serialize(() => {
                    database.run("INSERT INTO categories ( nom , parent_id) VALUES ( ? , ? )", [categorie.nom, categorie.parent_id], function (err) {
                        if (err) {
                            reject(err);
                        } else {
                            categorie.id = this.lastID;
                            resolve(categorie);
                        }
                    });
                });
            }
        } catch (err) {
            reject(err);
        }
    });
}

async function getAllProducts() {
    return new Promise((resolve, reject) => {
        database.serialize(() => {
            database.all("SELECT * FROM produits", (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    });
}

async function saveProduct(product) {
    return new Promise(async (resolve, reject) => {
        try {
            let _produits = await getAllProducts();
            let _produit = _produits.find((el) => el.id == product.id);
            if (_produit == undefined) {
                database.serialize(() => {
                    database.run("INSERT INTO produits ( nom , marque , ref_fab , ref_oem , prix_achat , prix_vente , categorie_id , subcategorie_id ) VALUES ( ? , ? , ? , ? , ? , ? , ? , ?)", [product.nom, product.marque, product.ref_fab, product.ref_oem, product.prix_achat, product.prix_vente, product.categorie_id, product.subcategorie_id], function (err) {
                        product.id = this.lastID;
                        resolve(product);
                    });
                });
            }
        } catch (err) {
            reject(err);
        }
    });
}

async function saveDevisProduct(deviProduct) {
    return new Promise(async (resolve, reject) => {
        try {
            database.serialize(() => {
                database.run("INSERT INTO devis_produits (  devis_id , produit_id , quantite  ) VALUES ( ? , ? , ? )", [deviProduct.devis_id, deviProduct.produit_id, deviProduct.quantite], function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        deviProduct.id = this.lastID;
                        resolve(deviProduct);
                    }
                });
            });
        } catch (err) {
            reject(err);
        }
    });
}

module.exports = {
    setdbPath,
    getAllFactures,

    getEntrepriseSettings,
    saveEntrepriseSettings,

    getPaiementSettings,
    savePaiementSettings,

    getLogoSettings,
    saveLogoSettings,

    getGeneralSettings,
    saveGeneralSettings,

    getAllClients,
    getClientById,
    saveClient,

    getAllVehicules,
    getVehiculeFromPlate,
    getVehiculeById,
    saveVehicule,

    getAllDevis,
    getDeviById,
    saveDevi,

    getAllCategories,
    saveCategorie,

    getAllProducts,
    saveProduct,

    saveDevisProduct,
}