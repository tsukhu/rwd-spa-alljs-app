/// <reference path="../Scripts/angular-1.1.4.js" />

var app = angular.module('travelApp', [ 'ngRoute', 'ngCookies', 'ngResource',
		'travelApp.directives.localWeather' ,'travelApp.directives.switch','googlechart' , 'i18n','angularSmoothscroll']);

app.factory('Poll', function($resource) {
	return $resource('polls/:pollId', {pollId: "@pollId" }, 
	{
		query : {
			method : 'GET',
			params : {
				pollId : 'polls'
			},
			isArray : true
		}
	})
});

app.factory('socket', function($rootScope) {
	var socket = io.connect();
	return {
		on : function(eventName, callback) {
			socket.on(eventName, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					callback.apply(socket, args);
				});
			});
			},
		emit : function(eventName, data, callback) {
			socket.emit(eventName, data, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					if (callback) {
						callback.apply(socket, args);
					}
				});
			})
		}
	};
});

// This configures the routes and associates each route with a view and a
// controller
app.config(function($routeProvider) {
	$routeProvider.when('/', {
		controller : 'MenuController',
		templateUrl : 'travelapp/partials/landingPage.html',
		resolve  : {
                           i18n    : [ "i18n", function( i18n ) { return i18n.i18n(); } ]
                    }
	}).when('/placesAll', {
		controller : 'DestinationsController',
		templateUrl : 'travelapp/partials/destinations.html',
		resolve  : {
                           i18n    : [ "i18n", function( i18n ) { return i18n.i18n(); } ]
                    }
	}).when('/groupedDestinations', {
		controller : 'GroupedDestinationsController',
		templateUrl : 'travelapp/partials/groupedDestinations.html',
		resolve  : {
                           i18n    : [ "i18n", function( i18n ) { return i18n.i18n(); } ]
                    }
	}).when('/profile', {
		controller : 'ProfileController',
		templateUrl : 'travelapp/partials/profile.html',
		resolve  : {
                           i18n    : [ "i18n", function( i18n ) { return i18n.i18n(); } ]
                    }
	}).when('/polls', {
		templateUrl : 'travelapp/partials/pollListing.html',
		controller : 'PollListCtrl'
	}).when('/poll/:pollId', {
		templateUrl : 'travelapp/partials/pollItem.html',
		controller : 'PollItemCtrl'
	}).when('/remove/:pollId', {
		templateUrl : 'travelapp/partials/pollListing.html',
		controller : 'PollRemoveItemCtrl'
	}).when('/new', {
		templateUrl : 'travelapp/partials/pollCreation.html',
		controller : 'PollNewCtrl'
	}).otherwise({
		redirectTo : '/'
	});
});
