
  //This controller retrieves data from the customersService and associates it with the $scope
//The $scope is ultimately bound to the customers view
app.controller('DestinationsController', ['$scope', '$http', 'travelService', function ($scope,$http, travelService) {

    //I like to have an init() for controllers that need to perform some initialization. Keeps things in
    //one place...not required though especially in the simple example below
	$scope.destinations = [];
    init();

    function init() {
        //$scope.destinations = travelService.getDestinations();
		travelService.getDestinations().then(function(dataResponse) {
        $scope.destinations = dataResponse.data;
		
    });
    }

}]);


app.controller('NavbarController', function ($scope, $location) {
    $scope.getClass = function (path) {
        if ($location.path().substr(0, path.length) == path) {
            return true
        } else {
            return false;
        }
    }
});

