var destination = require('./destinations');
var poll_routes = require('./poll_routes');
var video_streamer = require('./video_streamer');
var locales = [
				{ language: 'US English',
				  locale: 'en_US',
				  flag: 'us'},
				{ language: 'French',
				  locale: 'fr_fr',
				  flag: 'fr'} 
			];
delete require.cache['./routes/destinations'];

var i18n=require("i18n");
var i18nRoutes = require( "i18n-node-angular" );

i18n.configure({
    locales:['en_US', 'fr_fr'],
    cookie: 'locale',
    directory: __dirname + '/../locales',
    // you may alter a site wide default locale
    defaultLocale: 'en_US'
});


module.exports = function(app, passport) {
	// init i18n module for this loop
	initializedLocale=false;
  	app.use(i18n.init);
	app.use(i18nRoutes.getLocale );
	
	i18nRoutes.configure( app );
	
	app.get( "/i18n/:locale", function(req,res) {
		var locale = request.params.locale;
  		response.sendfile( "locales/" + locale + ".json" );
	});

    app.get( "/i18n/:locale/:phrase",  function(request,response) {
		var locale = request.params.locale;
  		var phrase = request.params.phrase;
  		var result = i18n.__( {phrase: phrase, locale: locale} );
  		response.send( result );
	});
    
	// Language Change
	app.get("/lang/:lang",function(req,res) {
		var locale=req.params.lang;
		res.cookie('locale', locale,{
		maxAge : 600000
	});
		console.log("Language Change ="+req.params.lang);
		res.setLocale(locale);
		res.redirect('/');
	});
	
	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
	   var locale=req.cookies.locale;
	   // if locale cookie not set 
	   // default to en_US
	   if (!locale || initializedLocale===false) {
	   	res.setLocale('en_US');
	   	initializedLocale=true;
	   	res.redirect('/lang/en_US');
	   	
	   }
	   	res.render('index', { title: 'India Tourism' ,_user : req.user , locales: locales});
	});

	// =====================================
	// Poll 
	// =====================================
	app.get('/polls', function(req, res) {
		res.render('polls', { title: 'Polls' ,_user : req.user });
	});
	
	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('login', { message: req.flash('loginMessage')});
	
	});

	// process the login form
	// app.post('/login', do all our passport stuff here);
	app.post('/login',passport.authenticate('local-login', {
		successRedirect : '/', // redirect to the home page
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));
	

	
	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('signup', { message: req.flash('signupMessage') });
	});
	

	// process the signup form
	// app.post('/signup', do all our passport stuff here);
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/', // redirect to the home page
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));
	
	// =====================================
	// PROFILE SECTION =====================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		//res.send(req.user);

	    res.render('profile', {
			user : req.user // get the user out of session and pass to template
		});
	});

	app.get('/profiledata', isLoggedIn, function(req, res) {
		res.send(req.user);
	});
	
	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		if (req.user) {
			req.user=null;
		}
		res.redirect('/');
	});
		
	app.get('/destinations', destination.findAll);
	app.get('/destinations/:id', destination.findById);
	app.post('/destinations', destination.addDestination);
	app.put('/destinations/:id', destination.updateDestination);
	app.delete('/destinations/:id', destination.deleteDestination);
	
	app.get('/polls/polls', poll_routes.list);
    app.get('/polls/:id', poll_routes.poll);
    app.post('/polls', poll_routes.create);
    app.post('/vote', poll_routes.vote);
    app.delete('/polls/:id', poll_routes.remove);
    
    app.get('/streamMovie/:fileName',video_streamer.streamMovie);
 //   app.get('/movie.ogg',video_streamer.movieOgg);
 //   app.get('/movie.webm',video_streamer.movieWebm);
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on 
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}

