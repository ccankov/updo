app.factory('appointment', ['$http', '__env', function($http, __env) {
    return function(id, method) {
        return $http({
            method: method,
            url: (__env.apiUrl + '/api/Appointment/' + id),
        });
    };
}]);