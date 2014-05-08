rwd-spa-alljs-app
=================

<h3>Responsive Single Page Application using an end to end Java Script stack</h3>
<br>
This is an attempt to build a SPA using an all Java Script stack. 
<br>
1) The theme for the application is a sample travel and tourism site using places in India as source and the plan is to add social elements to the same.<br>
2) The application will be using a travel destinations database persistence on MongoDB <br>
3) Server will be Node.js using the Express module for the Web Application Hosting <br>
4) RESTful CRUD APIs will be exposed on Node.js server using the  MongoDB driver module <br>
5) AngularJS will be used to build the SPA with Bootstrap (v3.x) providing the UI components. <br>
<br>
<h4>Tools Used</h4><br>
1) NodeEclipse <a href="http://www.nodeclipse.org/updates/">Plugin for Kepler</a><br>
2) Git Client for Windows<br>
3) MongoDB and Mongoose <br>
4) Bootrap 3.x <br>
5) AngularJS 1.3.x <br>
6) jQuery 1.10.1 <br>
7) Jade Templating for the main page <br>
8) PassportJS/connect-flash <br>
9) Node-config - is a configuration system for Node.js application server deployments.(development, qa, staging, production, etc.).<br>

<hr>
<h4>Installation</h4><br>
1) Setup MongoDB<br>
	- Install mongodb<br>
	- Create your database path <i>YOUR_DB_PATH</i><br>
	- Start Database server<br>
		- "mongodb mongod.exe --dbpath <i>YOUR_DB_PATH</i>"<br>
2) Install npm modules<br>
	- Run "npm install" at the base of the project directory (containing package.json)<br>
3) Start the node server<br>
	- node app.js<br>
4) Browse the application on any device using http://localhost:3000/

<br>
<h4>Added so far</h4><br>
1) Basic SPA infrastructure for Node.js/AngularJS/Bootstrap/Express/Connect/MongoDB<br>
2) Initial set of travel APIs (CRUD) for all destinations in India using MongoDB for persistence.<br>
3) A Bootstrap Carousel for India Travel Destinations (Needs improvement :-))<br>
4) Accordian view of all India Destinations sourced from the travel APIs with filters<br>
5) Group By view of all India Destinations grouped by India Region and State.Thanks to a blog by Ben Nadel covering <a href="http://www.bennadel.com/blog/2456-grouping-nested-ngrepeat-lists-in-angularjs.htm">how to implement groupBy in AngularJS using nested ngRepeat</a><br>
6) Integrated jQuery.simpleWeather and created an AngularJS directive for the same.<br>
7) Created a landing page with various bootstrap components including thumbnails , wells , panels , jumbotron. <br>
8) User login using localStrategy at the moment using passport.js,connect-flash,mongoose,bcrypt-nodejs for encryption. This has been modelled based on the excellent tutorial from <a href="http://scotch.io/tutorials/javascript/easy-node-authentication-setup-and-local">scotch.io</a> with additional integration and migration for supporting jade and AngularJS<br>
9) About me menu item now is displayed conditionally based on whether the user is logged-in and shows the user profile details , otherwise a drop-down menu is displayed<br>
<br>
Work in Progress ... Please read the <a href="https://github.com/tsukhu/rwd-spa-alljs-app/wiki">wiki</a> or take a look at the  <a href="https://github.com/tsukhu/rwd-spa-alljs-app/issues?state=open">issue tracker</a> for the future roadmap.
