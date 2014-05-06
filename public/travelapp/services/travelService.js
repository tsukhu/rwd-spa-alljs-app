app.service('travelService', function($http) {
delete $http.defaults.headers.common['X-Requested-With'];

this.getDestinations = function() {
    // $http() returns a $promise that we can add handlers with .then()
    return $http({
        method: 'GET',
        url: 'http://localhost:3000/destinations',
        params: null, //'limit=10, sort_by=created:desc',
        headers: null //{'Authorization': 'Token token=xxxxYYYYZzzz'}
     });
 }
});

