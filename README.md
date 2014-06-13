rwd-spa-alljs-app
=================

[![Build Status](https://secure.travis-ci.org/tsukhu/rwd-spa-alljs-app.png?branch=master)](https://travis-ci.org/tsukhu/rwd-spa-alljs-app)

Responsive Single Page Application using an end to end Java Script stack
------------------------------------------------------------------------


This is an attempt to build a SPA using an all Java Script stack. 


* The theme for the application is a sample travel and tourism site using places in India as source and the plan is to add social elements to the same.
* The application will be using a travel destinations database persistence on MongoDB
* Server will be Node.js using the Express module for the Web Application Hosting
* RESTful CRUD APIs will be exposed on Node.js server using the  MongoDB driver module
* AngularJS will be used to build the SPA with Bootstrap (v3.x) providing the UI components.
* Socket.io based real time travel poll with chart based results.

Tools Used
----------

* NodeEclipse [Plugin for Kepler](http://www.nodeclipse.org/updates)
* Git Client for Windows
* MongoDB and Mongoose
* Bootrap 3.x
* AngularJS 1.3.x (ngRouter/ngCookies)
* jQuery 1.10.1
* Jade Templating for the main page
* PassportJS/connect-flash
* Node-config - is a configuration system for Node.js application server deployments.(development, qa, staging, production, etc.).
* Grunt/Mocha/Chai
* Travis CI Service Hook
* Socket.io 0.9.x
 

Installation
------------

* Setup MongoDB
* Install mongodb
* Create your database path <i>YOUR_DB_PATH</i>
* Start Database server	`mongod --dbpath <i>YOUR_DB_PATH</i>`
* Install npm modules
* Run `npm install` at the base of the project directory (containing package.json)
* Run `npm install -g grunt-cli` to install grunt command line interface globally
* Start the node server
* `node app.js`
* Browse the application on any device using http://localhost:3000/
* Or you could use the npm commands
* Run Server `npm start`
* Run Tests `npm test`

Added so far
------------
* Basic SPA infrastructure for Node.js/AngularJS/Bootstrap/Express/Connect/MongoDB
* Initial set of travel APIs (CRUD) for all destinations in India using MongoDB for persistence.
* A Bootstrap Carousel for India Travel Destinations (Needs improvement :-))
* Accordian view of all India Destinations sourced from the travel APIs with filters
* Group By view of all India Destinations grouped by India Region and State.Thanks to a blog by Ben Nadel covering [how to implement groupBy in AngularJS using nested ngRepeat](http://www.bennadel.com/blog/2456-grouping-nested-ngrepeat-lists-in-angularjs.htm)
* Integrated jQuery.simpleWeather and created an AngularJS directive for the same.
* Created a landing page with various bootstrap components including thumbnails , wells , panels , jumbotron.
* User login using localStrategy at the moment using passport.js,connect-flash,mongoose,bcrypt-nodejs for encryption. This has been modelled based on the excellent tutorial from [scotch.io](http://scotch.io/tutorials/javascript/easy-node-authentication-setup-and-local) with additional integration and migration for supporting jade and AngularJS. Also added support for sign up and login using email or username with rememberme functionality.
* About me menu item now is displayed conditionally based on whether the user is logged-in and shows the user profile details , otherwise a drop-down menu is displayed
* By default sessions are stored in memory by Express, so added external storage of Mongodb using connect-mongo plus cookies have also been enabled.
* Added angular-cookies to persist the filter values of the destinations in the places page. Now the filter value entered is retained when you switch between different partials.Using the ngCookies modules and injected $cookieStore into the destinations controller.
* Implemented rememberme functionality
* Added node-config based handling for standardizing deployment across different environments - dev, qa , prod
* Migrated to Express 4.x
* Added basic infrastructure server side mocha/chai tests using grunt-mocha-test module
* Enabled CI using Travis CI Service Hook
* Initial Stages of adding a real time travel user poll based on the excellent article by [Joe Lenon](http://www.ibm.com/developerworks/library/wa-nodejs-polling-app/) using socket.io
* Enhancements added to the user poll so far include
** Delete Poll 
** Poll Listing Improvements with delete functionality as well as bootstrapped the initial set of poll questions
** Chart integration for the real time poll results (WIP)
* Work in Progress ... Please read the [project wiki](https://github.com/tsukhu/rwd-spa-alljs-app/wiki) or take a look at the [issue tracker](https://github.com/tsukhu/rwd-spa-alljs-app/issues?state=open) for the future roadmap.
