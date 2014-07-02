app.service('travelService', ['$http','CONFIG',function($http,CONFIG) {
delete $http.defaults.headers.common['X-Requested-With'];

this.getDestinations = function() {
    // $http() returns a $promise that we can add handlers with .then()
    return $http({
        method: 'GET',
        url: 'http://'+CONFIG.hostname+':'+CONFIG.port+'/destinations',
        params: null, //'limit=10, sort_by=created:desc',
        headers: null //{'Authorization': 'Token token=xxxxYYYYZzzz'}
     });
 }

this.getProfile = function() {
    // $http() returns a $promise that we can add handlers with .then()
    return $http({
        method: 'GET',
        url: 'http://'+CONFIG.hostname+':'+CONFIG.port+'/profiledata',
        params: null, //'limit=10, sort_by=created:desc',
        headers: null //{'Authorization': 'Token token=xxxxYYYYZzzz'}
     });
 }
}]);

