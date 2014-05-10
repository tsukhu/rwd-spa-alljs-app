//This controller retrieves data from the RESTful destinations API and associates it with the $scope
//The $scope is ultimately bound to the customers view
app.controller('DestinationsController', [
		'$scope',
		'$http',
		'$cookieStore',
		'travelService',
		function($scope, $http, $cookieStore, travelService) {

			// I like to have an init() for controllers that need to perform
			// some initialization. Keeps things in
			// one place...not required though especially in the simple example
			// below
			$scope.destinations = [];
			$scope.user = null;
			$scope.favRegion=null;
			//$scope.favRegion = null;
			init();
			function init() {
				// $scope.destinations = travelService.getDestinations();
				travelService.getDestinations().then(function(dataResponse) {
					$scope.destinations = dataResponse.data;


				});

				travelService.getProfile().then(function(dataResponse) {
					$scope.user = dataResponse.data;

				});

				$scope.favRegion = $cookieStore.get('favRegion');
				
				//this.filter.region= "test";
			//	alert($scope.favRegion);
			}

			$scope.setValue = function(favRegion) {
				
				if (favRegion) {
					
					$scope.favRegion = favRegion;
					$cookieStore.put('favRegion', $scope.favRegion);

				}
			}

			
			$scope.getWeather = function(divId, location) {
				alert("SimpleWeather Called");
				jQuery.simpleWeather({
					location : 'Austin, TX',
					woeid : '',
					unit : 'f',
					success : function(weather) {
						html = '<h2><i class="icon-' + weather.code + '"></i> '
								+ weather.temp + '&deg;' + weather.units.temp
								+ '</h2>';
						html += '<ul><li>' + weather.city + ', '
								+ weather.region + '</li>';
						html += '<li class="currently">' + weather.currently
								+ '</li>';
						html += '<li>' + weather.wind.direction + ' '
								+ weather.wind.speed + ' '
								+ weather.units.speed + '</li></ul>';
						alert("#" + divId);
						$("#" + divId).html(html);
					},
					error : function(error) {
						alert("#" + divId);
						$("#" + divId).html('<p>' + error + '</p>');
					}
				});
			}
		} ]);

// This controller retrieves data from the RESTful destinations API and
// associates it with the $scope
// The $scope is ultimately bound to the customers view
app.controller('GroupedDestinationsController', [ '$scope', '$http',
		'travelService', function($scope, $http, travelService) {

			// I like to have an init() for controllers that need to perform
			// some initialization. Keeps things in
			// one place...not required though especially in the simple example
			// below
			$scope.destinations = [];
			$scope.groups = [];
			init();

			function init() {
				// $scope.destinations = travelService.getDestinations();
				travelService.getDestinations().then(function(dataResponse) {
					$scope.destinations = dataResponse.data;

				});
			}

			// I sort the given collection on the given property.
			function sortOn(collection, region) {

				collection.sort(function(a, b) {

					if (a[region] <= b[region]) {

						return (-1);

					}

					return (1);

				});

			}

			// -- Define Scope Methods. ----------------- //

			// group destinations list on the given property.
			$scope.groupBy = function(attribute) {

				// First, reset the groups.
				$scope.groups = [];

				// Now, sort the collection of friend on the
				// grouping-property. This just makes it easier
				// to split the collection.
				sortOn($scope.destinations, attribute);

				// I determine which group we are currently in.
				var groupValue = "_INVALID_GROUP_VALUE_";

				// As we loop over each friend, add it to the
				// current group - we'll create a NEW group every
				// time we come across a new attribute value.
				for (var i = 0; i < $scope.destinations.length; i++) {

					var destination = $scope.destinations[i];
					// Should we create a new group?
					if (destination[attribute] !== groupValue) {

						var group = {
							label : destination[attribute],
							destinations : []
						};

						groupValue = group.label;

						$scope.groups.push(group);

					}

					// Add the destination to the currently active
					// grouping.
					group.destinations.push(destination);

				}

			};

		} ]);
// This controller for the menu actions which checked if the getClass is true
// to initiate the route
app.controller('MenuController', function($scope, $location) {
	$scope.isActive = function(viewLocation) {
		var active = (viewLocation === $location.path());
		return active;
	};
});

app.controller('ProfileController', [ '$scope', '$http',
		'travelService', function($scope, $http, travelService) {

			// I like to have an init() for controllers that need to perform
			// some initialization. Keeps things in
			// one place...not required though especially in the simple example
			// below
			$scope.user = null;

			travelService.getProfile().then(function(dataResponse) {
				$scope.user = dataResponse.data;

			});

		} ]);
