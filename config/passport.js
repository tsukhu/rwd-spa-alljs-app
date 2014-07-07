// config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var User = require('../models/user');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) {

            // asynchronous
            // User.findOne wont fire unless data is sent back
            process.nextTick(function() {


                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists
                User.findOne({
                    'local.email': email
                }, function(err, user) {
                    // if there are any errors, return the error
                    if (err) {
                        return done(err);
                    }

                    // check to see if theres already a user with that email
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'This email (' + email + ')is already taken.'));
                    } else {
                        console.log(req.body.username);
                        if (req.body.username !== null) {

                            User.findOne({
                                'local.username': req.body.username
                            }, function(err, user) {
                                if (err) {
                                    return done(err);
                                }

                                // check to see if theres already a user with that email
                                if (user) {
                                    return done(null, false, req.flash('signupMessage', 'This username (' + req.body.username + ')is already taken.'));
                                } else {
                                    // if there is no user with that email or username
                                    // create the user
                                    var newUser = new User();

                                    // set the user's local credentials
                                    newUser.local.email = email;
                                    newUser.local.username = req.body.username;
                                    newUser.local.password = newUser.generateHash(password); // use the generateHash function in our user model
                                    console.log(newUser.local.email + " : " + newUser.local.username + " : " + newUser.local.password);
                                    // save the user
                                    newUser.save(function(err) {
                                        if (err) {
                                            throw err;
                                        }
                                        return done(null, newUser);
                                    });

                                }
                            });

                        } else {
                            // if there is no user with that email or username
                            // create the user
                            var newUser = new User();

                            // set the user's local credentials
                            newUser.local.email = email;
                            newUser.local.password = newUser.generateHash(password); // use the generateHash function in our user model
                            //console.log(newUser.local.email + " : " + newUser.local.username + " : " + newUser.local.password);
                            // save the user
                            newUser.save(function(err) {
                                if (err) {
                                    throw err;
                                }
                                return done(null, newUser);
                            });
                        }



                    } //else
                }); //find email


            }); //process.nextTick()


        }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) { // callback with email and password from our form

            // login form hidden field for login option (username or email)
            // if username set then set the key for username and password
            if (req.body.loginOption === 'login-user') {
                // find a user whose email is the same   the forms email
                // we are checking to see if the user trying to login already exists
                User.findOne({
                    'local.username': req.body.username
                }, function(err, user) {
                    // if there are any errors, return the error before anything else
                    if (err) {
                        return done(err);
                    }
                    // if no user is found, return the message
                    if (!user) {
                        return done(null, false, req.flash('loginMessage', 'No ' + req.body.username + ' found.')); // req.flash is the way to set flashdata using connect-flash
                    }
                    // if the user is found but the password is wrong
                    if (!user.validPassword(password)) {
                        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                    }
                    console.log("passport rememberme = " + req.cookies.rememberme);

                    if (req.body.rememberme) {
                        var thirtyDays = 30 * 24 * 60 * 60 * 1000;
                        req.session.cookie.expires = new Date(Date.now() + thirtyDays);
                        req.session.cookie.maxAge = thirtyDays;
                    } else {
                        req.session.cookie.expires = false;
                    }
                    console.log("returned user =" + user);
                    // all is well, return successful user
                    return done(null, user);

                });
            } else {
                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists
                User.findOne({
                    'local.email': email
                }, function(err, user) {
                    // if there are any errors, return the error before anything else
                    if (err) {
                        return done(err);
                    }
                    // if no user is found, return the message
                    if (!user) {
                        return done(null, false, req.flash('loginMessage', 'No ' + email + ' found.')); // req.flash is the way to set flashdata using connect-flash
                    }
                    // if the user is found but the password is wrong
                    if (!user.validPassword(password)) {
                        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                    }
                    console.log("passport rememberme = " + req.cookies.rememberme);

                    if (req.body.rememberme) {
                        var thirtyDays = 30 * 24 * 60 * 60 * 1000;
                        req.session.cookie.expires = new Date(Date.now() + thirtyDays);
                        req.session.cookie.maxAge = thirtyDays;
                    } else {
                        req.session.cookie.expires = false;
                    }
                    console.log("returned user =" + user);
                    // all is well, return successful user
                    return done(null, user);

                });
            }




        }));

};
