// config/userDb.js

var CONFIG = require('config').travelapp;

module.exports = {

    'url': CONFIG.userDbUrl,
    'pollsUrl': CONFIG.pollDbUrl
};
