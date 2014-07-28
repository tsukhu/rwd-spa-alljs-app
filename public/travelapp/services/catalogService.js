angular.module('catalogService', ['ngResource']).
factory('Packages', function($resource) {
    return $resource('catalog/:catalogId.json', {}, {
        query: {
            method: 'GET',
            params: {
                catalogId: 'catalog'
            },
            isArray: true
        }
    });
});
