/// <reference path="../Scripts/angular-1.1.4.js" />

var app = angular.module('travelApp', [ 'ngRoute', 'ngCookies', 'ngResource',
		'travelApp.directives.localWeather' ,'travelApp.directives.switch','travelApp.directives.equalHeight','travelApp.directives.canvasjs','googlechart' , 'i18n','angularSmoothscroll','ui.bootstrap','travelapp.config','ngDialog','ngMap','catalogService','catalogFilters']);

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
	});
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
			});
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
                           i18n    : [ "i18n", function( i18n ) { return i18n.i18n(); } ],
                           loggedin: checkLoggedin
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
		controller : 'PollListCtrl',
		resolve  : {
                           loggedin: checkLoggedin
                    }
	}).when('/poll/:pollId', {
		templateUrl : 'travelapp/partials/pollItem.html',
		controller : 'PollItemCtrl'
	}).when('/remove/:pollId', {
		templateUrl : 'travelapp/partials/pollListing.html',
		controller : 'PollRemoveItemCtrl'
	}).when('/new', {
		templateUrl : 'travelapp/partials/pollCreation.html',
		controller : 'PollNewCtrl'
	}).when('/dash', {
		templateUrl : 'travelapp/partials/dashboard.html',
		controller : 'DashController'
	}).when('/invoice', {
		templateUrl : 'travelapp/partials/invoice.html',
		controller : 'InvoiceController'
	}).when('/catalog', {
		templateUrl : 'travelapp/partials/packageList.html',
		controller : 'PackageListController'
	}).when('/catalog/:catalogId', {
		templateUrl : 'travelapp/partials/packageDetails.html',
		controller : 'PackageDetailsController'
	}).otherwise({
		redirectTo : '/'
	});
});

// Interceptor to avoid user from accessing protected pages which 
// require logging in.
app.config(function($httpProvider) {
	$httpProvider.responseInterceptors.push(function($q, $location) {
    return function(promise) {
     return promise.then(
     // Success: just return the response
     function(response){
     	return response;
     },
     // Error: check the error status to get only the 401
     function(response) {
     	if (response.status === 401)
     		$location.url('/login');
     	return $q.reject(response);
     }
     );
     };
	});
});

var checkLoggedin = function($q, $timeout, $http, $location, $rootScope)
{
	// Make an AJAX call to check if the user is logged in
	var loggedIn = $http.get('/loggedin');
	$rootScope.user = 0;
	loggedIn.then(function(dataResponse) {
        $rootScope.user = dataResponse.data;

	});
};