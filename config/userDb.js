// config/userDb.js

var CONFIG = require('config').travelapp;
var connection = CONFIG.dbUrl;

if (process.env.OPENSHIFT_MONGODB_DB_URL) {
    connection = process.env.OPENSHIFT_MONGODB_DB_URL + CONFIG.dbName;
}



module.exports = {
    'dbUrl': connection,
    'dbHost': CONFIG.dbHost,
    'dbPort': CONFIG.dbPort,
    'dbName': CONFIG.dbName,
    'dbWithAuth': CONFIG.dbWithAuth,
    'options': {}
};
