/**
 * Module dependencies.
 */
var connect = require('connect');
var express = require('express')
  , routes = require('./routes')
  , destination = require('./routes/destinations')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
delete require.cache['./routes/destinations'];
// Create a web server on port 8080
connect.createServer(connect.static(__dirname)).listen(8080);

var app = express();

// all environments
app.configure(function () {
	app.set('port', process.env.PORT || 4000);
	//app.set('views', __dirname + '/views');
	//app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));   /* 'default', 'short', 'tiny', 'dev' */
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
});


// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);


app.get('/destinations', destination.findAll);
app.get('/destinations/:id', destination.findById);
app.post('/destinations', destination.addDestination);
app.put('/destinations/:id', destination.updateDestination);
app.delete('/destinations/:id', destination.deleteDestination);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
