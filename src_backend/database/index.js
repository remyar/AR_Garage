const sqlite3 = require('sqlite3');

let database = undefined;

async function createTables() {
    return new Promise((resolve, reject) => {
        try {
            database.serialize(() => {
                database.run("CREATE TABLE IF NOT EXISTS devis ( id INTEGER PRIMARY KEY , client_id INTEGER, vehicule_id INTEGER , date INTEGER , expiration INTEGER , total REAL)");
                database.run("CREATE TABLE IF NOT EXISTS devis_produits ( id INTEGER PRIMARY KEY , devis_id INTEGER, produit_id INTEGER , quantite REAL)");
                database.run("CREATE TABLE IF NOT EXISTS devis_services ( id INTEGER PRIMARY KEY , devis_id INTEGER, service_id INTEGER , quantite REAL , prix_vente REAL )");

                database.run("CREATE TABLE IF NOT EXISTS factures ( id INTEGER PRIMARY KEY , client_id INTEGER, vehicule_id INTEGER , date INTEGER , total REAL)");
                database.run("CREATE TABLE IF NOT EXISTS factures_produits ( id INTEGER PRIMARY KEY , factures_id INTEGER, produit_id INTEGER , quantite REAL)");
                database.run("CREATE TABLE IF NOT EXISTS factures_services ( id INTEGER PRIMARY KEY , factures_id INTEGER, service_id INTEGER , quantite REAL , prix_vente REAL )");

                database.run("CREATE TABLE IF NOT EXISTS settings_entreprise ( id INTEGER PRIMARY KEY , nom TEXT, adresse1 TEXT , adresse2 TEXT , code_postal TEXT , ville TEXT , email TEXT, siret TEXT , telephone TEXT , rcs TEXT )");
                database.run("CREATE TABLE IF NOT EXISTS settings_paiement ( id INTEGER PRIMARY KEY , nom TEXT, iban TEXT , _order TEXT )");
                database.run("CREATE TABLE IF NOT EXISTS settings_logo ( id INTEGER PRIMARY KEY , logo TEXT )");
                database.run("CREATE TABLE IF NOT EXISTS settings_general ( id INTEGER PRIMARY KEY , wizard INTEGER )");

                database.run("CREATE TABLE IF NOT EXISTS clients ( id INTEGER PRIMARY KEY , nom TEXT , prenom TEXT , adresse1 TEXT , adresse2 TEXT , code_postal TEXT , ville TEXT , email TEXT , telephone TEXT )");
                database.run("CREATE TABLE IF NOT EXISTS vehicules ( id INTEGER PRIMARY KEY , oscaroId INTEGER,brand TEXT , model TEXT , puissance TEXT , phase TEXT , designation TEXT , engineCode TEXT , gearboxCode TEXT , immatriculationDate TEXT, vin TEXT, energy TEXT, plate TEXT )");
                database.run("CREATE TABLE IF NOT EXISTS produits ( id INTEGER PRIMARY KEY , nom TEXT , marque TEXT , ref_fab TEXT , ref_oem TEXT , categorie_id INTEGER , subcategorie_id INTEGER , prix_achat REAL , prix_vente REAL )");
                database.run("CREATE TABLE IF NOT EXISTS services ( id INTEGER PRIMARY KEY , nom TEXT , ref_fab TEXT )");
                database.run("CREATE TABLE IF NOT EXISTS categories ( id INTEGER PRIMARY KEY , nom TEXT , parent_id )");
                resolve();
            });
        } catch (err) {
            reject(err);
        }
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
                reject(err);
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

async function getFactureById(id) {
    return new Promise((resolve, reject) => {
        database.serialize(() => {
            database.all("SELECT * FROM factures WHERE id LIKE ?", [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row[0] || {});
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
                        ], function (err) {
                            if (err) {
                                reject(err);
                            } else {
                                settings.id = this.lastID;
                                resolve(settings);
                            }
                        });
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
                    ], function (err) {
                        if (err) {
                            reject(err);
                        } else {
                            settingsEntreprise = { ...settingsEntreprise, ...settings };
                            resolve(settingsEntreprise);
                        }
                    });
                });
            }
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
                        ], function (err) {
                            if (err) {
                                reject(err);
                            } else {
                                settings.id = this.lastID;
                                resolve(settings);
                            }
                        });
                });
            } else {
                //-- update
                database.serialize(() => {
                    database.run("UPDATE settings_paiement SET nom=?,iban=?,_order=? WHERE id=?", [
                        settings.nom,
                        settings.iban,
                        settings.order,
                        settingsPaiement.id
                    ], function (err) {
                        if (err) {
                            reject(err);
                        } else {
                            settingsPaiement = { ...settingsPaiement, ...settings };
                            resolve(settingsPaiement);
                        }
                    });
                });
            }
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
                        ], function (err) {
                            if (err) {
                                reject(err);
                            } else {
                                settings.id = this.lastID;
                                resolve(settings);
                            }
                        });
                });
            } else {
                //-- update
                database.serialize(() => {
                    database.run("UPDATE settings_logo SET logo=? WHERE id=?", [
                        settings,
                        settingsLogo.id
                    ], function (err) {
                        if (err) {
                            reject(err);
                        } else {
                            settingsLogo = { ...settingsLogo, ...settings };
                            resolve(settingsLogo);
                        }
                    });
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
                        ], function (err) {
                            if (err) {
                                reject(err);
                            } else {
                                vehicule.id = this.lastID;
                                resolve(vehicule);
                            }
                        });
                });

            } else {
                database.serialize(() => {
                    database.run("UPDATE vehicules SET oscaroId=? , brand=? , model=? , puissance=? , phase=? , designation=? , engineCode=? , gearboxCode=? , immatriculationDate=? ,vin=? ,energy=?, plate=? WHERE id=?",
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
                        ], function (err) {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(vehicule);
                            }
                        });
                });
            }
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
                    database.run("INSERT INTO devis ( client_id , vehicule_id , date , expiration , total ) VALUES ( ? , ? , ? , ? , ? )", [devi.client_id, devi.vehicule_id, devi.date, devi.expiration, devi.total], function (err) {
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

async function saveFacture(facture) {
    return new Promise(async (resolve, reject) => {
        try {
            let _factures = await getAllFactures();
            let _facture = _factures.find((el) => el.id == facture.id);
            if (_facture == undefined) {
                //-- insert
                database.serialize(() => {
                    database.run("INSERT INTO factures ( client_id , vehicule_id , date , total ) VALUES ( ? , ? , ? , ? )", [facture.client_id, facture.vehicule_id, facture.date, facture.total], function (err) {
                        if (err) {
                            reject(err);
                        } else {
                            facture.id = this.lastID;
                            resolve(facture);
                        }
                    });
                });
            } else {

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

async function getProductById(id) {
    return new Promise((resolve, reject) => {
        database.serialize(() => {
            database.all("SELECT * FROM produits WHERE id LIKE ?", [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row[0] || {});
                }
            });
        });
    });
}

async function getServiceById(id) {
    return new Promise((resolve, reject) => {
        database.serialize(() => {
            database.all("SELECT * FROM services WHERE id LIKE ?", [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row[0] || {});
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
                        if (err) {
                            reject(err);
                        } else {
                            product.id = this.lastID;
                            resolve(product);
                        }
                    });
                });
            } else {
                database.serialize(() => {
                    database.run("UPDATE produits SET nom=? , marque=? , ref_fab=? , ref_oem=? , prix_achat=? , prix_vente=? , categorie_id=? , subcategorie_id=? WHERE id=?",
                        [
                            product.nom, product.marque, product.ref_fab, product.ref_oem, product.prix_achat, product.prix_vente, product.categorie_id, product.subcategorie_id,
                            _produit.id
                        ], function (err) {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(product);
                            }
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

async function saveFacturesProduct(factureProduct) {
    return new Promise(async (resolve, reject) => {
        try {
            database.serialize(() => {
                database.run("INSERT INTO factures_produits (  factures_id , produit_id , quantite  ) VALUES ( ? , ? , ? )", [factureProduct.factures_id, factureProduct.produit_id, factureProduct.quantite], function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        factureProduct.id = this.lastID;
                        resolve(factureProduct);
                    }
                });
            });
        } catch (err) {
            reject(err);
        }
    });
}

async function saveDevisService(deviService) {
    return new Promise(async (resolve, reject) => {
        try {
            database.serialize(() => {
                database.run("INSERT INTO devis_services ( devis_id , service_id , quantite , prix_vente ) VALUES ( ? , ? , ? , ?)", [deviService.devis_id, deviService.service_id, deviService.quantite, deviService.prix_vente], function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        deviService.id = this.lastID;
                        resolve(deviService);
                    }
                });
            });
        } catch (err) {
            reject(err);
        }
    });
}

async function saveFacturesService(factureService) {
    return new Promise(async (resolve, reject) => {
        try {
            database.serialize(() => {
                database.run("INSERT INTO factures_services ( factures_id , service_id , quantite , prix_vente ) VALUES ( ? , ? , ? , ?)", [factureService.factures_id, factureService.service_id, factureService.quantite, factureService.prix_vente], function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        factureService.id = this.lastID;
                        resolve(factureService);
                    }
                });
            });
        } catch (err) {
            reject(err);
        }
    });
}

async function getDeviProduitsByDeviId(devisId) {
    return new Promise((resolve, reject) => {
        database.serialize(() => {
            database.all("SELECT * FROM devis_produits WHERE devis_id LIKE ?", [devisId], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    });
}

async function getFactureProduitsByDeviId(factureId) {
    return new Promise((resolve, reject) => {
        database.serialize(() => {
            database.all("SELECT * FROM factures_produits WHERE factures_id LIKE ?", [factureId], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    });
}

async function getFactureServicesByDeviId(factureId) {
    return new Promise((resolve, reject) => {
        database.serialize(() => {
            database.all("SELECT * FROM factures_services WHERE factures_id LIKE ?", [factureId], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    });
}


async function getDeviServicesByDeviId(devisId) {
    return new Promise((resolve, reject) => {
        database.serialize(() => {
            database.all("SELECT * FROM devis_services WHERE devis_id LIKE ?", [devisId], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    });
}

async function getAllServices() {
    return new Promise((resolve, reject) => {
        database.serialize(() => {
            database.all("SELECT * FROM services", (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    });
}

async function saveService(service) {
    return new Promise(async (resolve, reject) => {
        try {
            let _services = await getAllServices();
            let _service = _services.find((el) => el.id == service.id);
            if (_service == undefined) {
                database.serialize(() => {
                    database.run("INSERT INTO services ( nom , ref_fab ) VALUES ( ? , ? )", [service.nom, service.ref_fab], function (err) {
                        service.id = this.lastID;
                        resolve(service);
                    });
                });
            }
        } catch (err) {
            reject(err);
        }
    });
}

module.exports = {
    setdbPath,

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
    getProductById,
    saveProduct,

    saveDevisProduct,
    saveFacturesProduct,
    getDeviProduitsByDeviId,
    getFactureProduitsByDeviId,

    getAllServices,
    getServiceById,
    saveService,

    saveDevisService,
    saveFacturesService,
    getDeviServicesByDeviId,
    getFactureServicesByDeviId,

    getAllFactures,
    getFactureById,
    saveFacture,
}