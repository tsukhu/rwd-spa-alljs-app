/// <reference path="../Scripts/angular-1.1.4.js" />


var app = angular.module('travelApp', ['ngRoute']);

//This configures the routes and associates each route with a view and a controller
app.config(function ($routeProvider) {
    $routeProvider
		.when('/',
            {
                controller: 'NavbarController',
                templateUrl: '/travelapp/partials/landingPage.html'
            })
        .when('/places',
            {
                controller: 'DestinationsController',
                templateUrl: '/travelapp/partials/destinations.html'
            })
        .otherwise({ redirectTo: '/' });
});




