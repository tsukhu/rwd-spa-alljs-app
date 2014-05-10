/// <reference path="../Scripts/angular-1.1.4.js" />


var app = angular.module('travelApp', [
             'ngRoute',
             'ngCookies',
             'travelApp.directives.localWeather'
             
             ]);

//This configures the routes and associates each route with a view and a controller
app.config(function ($routeProvider) {
    $routeProvider
		.when('/',
            {
                controller: 'MenuController',
                templateUrl: 'travelapp/partials/landingPage.html'
            })
        .when('/placesAll',
            {
                controller: 'DestinationsController',
                templateUrl: 'travelapp/partials/destinations.html'
            })
         .when('/groupedDestinations',
            {
                controller: 'GroupedDestinationsController',
                templateUrl: 'travelapp/partials/groupedDestinations.html'
            })
         .when('/profile',
            {
                controller: 'ProfileController',
                templateUrl: 'travelapp/partials/profile.html'
            })
        .otherwise({ redirectTo: '/' });
});




