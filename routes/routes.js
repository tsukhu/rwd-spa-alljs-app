var destination = require('./destinations');
var poll_routes = require('./poll_routes');
var video_streamer = require('./video_streamer');
var locales = [{ language: 'US English',
				  locale: 'en_US'}];
delete require.cache['./routes/destinations'];


module.exports = function(app, passport) {

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		res.render('index', { title: 'India Tourism' ,_user : req.user });
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