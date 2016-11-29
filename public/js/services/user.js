app.factory('user', ['$http', '__env', function($http, __env) {
    return function(id) {
        return $http({
            method: 'GET',
            url: (__env.apiUrl + '/api/User/' + id),
        });
    };
}]);