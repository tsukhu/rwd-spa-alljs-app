/**
 * Module dependencies.
 */
var express = require('express');

//http server
var http = require('http');

//Server path utils
var path = require('path');

//app icon
var favicon = require('serve-favicon');

// express related logging
var logger = require('morgan');

//Parse Cookie header and populate req.cookies
var cookieParser = require('cookie-parser');

//Parse request bodies
var bodyParser = require('body-parser');

//Provides faux HTTP method
var methodOverride = require('method-override');

//Development error handler
var errorHandler = require('errorhandler');

// mongodb OM
var mongoose = require('mongoose');

//user auth
var passport = require('passport');

//session flash messages
var flash = require('connect-flash');

// get the environment specific configuration
var CONFIG = require('config').travelapp;

// Setup Database config for mongoose
var configDB = require('./config/userDb.js');

var session = require('express-session');

var MongoStore = require('connect-mongo')(session);

// Openshift Mongo DB env variable check
var connection = process.env.OPENSHIFT_MONGODB_DB_URL || CONFIG.dbUrl;
// configuration ===============================================================


var app = express();

var server = http.createServer(app);

//initialize socket.io
var io = require('socket.io').listen(server);

var allowCrossDomain = function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
};

require('./config/passport')(passport); // pass passport for configuration

var port = process.env.OPENSHIFT_NODEJS_PORT || CONFIG.port,
    ip = process.env.OPENSHIFT_NODEJS_IP || CONFIG.appHost;

// all environments
app.set('port', port);
app.set('ipaddress', ip);
app.set('views', __dirname + CONFIG.viewDir);
app.set('view engine', 'jade');
app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, CONFIG.publicFolder))); // location of the files

//Handle Errors gracefully
app.use(function(err, req, res, next) {
    if (!err) {
        return next();
    }
    console.log(err.stack);
    res.json({
        error: true
    });
});

// development only
if ('development' === app.get('env')) {
    app.use(errorHandler());
    app.use(allowCrossDomain);
}

mongoose.connect(configDB.dbUrl, configDB.options, function(e) {

    // If error connecting
    if (e) {
        throw e;
    }
    // required for passport
    app.use(session({
        secret: CONFIG.secret, // session secret
        store: new MongoStore({
            url: configDB.dbUrl,
            maxAge: CONFIG.cookie_max_age,
            clear_interval: 3600,
            auto_reconnect: true
        }),
        cookie: {
            maxAge: CONFIG.cookie_max_age
            // one week
        }
    }));

    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions
    app.use(flash()); // use connect-flash for flash messages stored in session

    require('./routes/routes.js')(app, passport); // load our routes and pass in
    // our app and fully configured
    // passport

    var poll_routes = require('./routes/poll_routes');

    // listen on connection event using callback method of vote
    io.sockets.on('connection', poll_routes.vote);

    server.listen(port, ip, function() {
        console.log('Express server listening on port ' + port + " ip:" + ip);
    });

}); // connect to our database
