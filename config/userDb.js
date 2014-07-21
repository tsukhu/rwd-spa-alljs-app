// config/userDb.js

var CONFIG = require('config').travelapp;

module.exports = {
	'dbUrl': CONFIG.dbUrl,
    'dbHost': CONFIG.dbHost,
    'dbPort': CONFIG.dbPort,
    'dbName': CONFIG.dbName,
    'dbWithAuth': CONFIG.dbWithAuth,
    'options': {

    }
};
