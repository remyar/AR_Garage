const devis = require('./devis');
const devis_produits = require('./devis_produits');
const devis_services = require('./devis_services');
const factures = require('./factures');
const factures_produits = require('./factures_produits');
const settings_entreprise = require('./settings_entreprise');
const settings_paiement = require('./settings_paiement');
const settings_logo = require('./settings_logo');
const settings_general = require('./settings_general');
const clients = require('./clients');
const vehicules = require('./vehicules');
const produits = require('./produits');
const services = require('./services');
const oem = require('./oem');

module.exports = {
    database : {
        devis,
        devis_produits,
        devis_services,
        factures,
        factures_produits,
        settings_entreprise,
        settings_paiement,
        settings_logo,
        settings_general,
        clients,
        vehicules,
        produits,
        services,
        oem
    }
}