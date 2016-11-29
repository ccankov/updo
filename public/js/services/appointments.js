app.factory('appointments', ['$http', '__env', function($http, __env) {
  return $http.get(__env.apiUrl + '/api/Appointments')
         .success(function(data) {
           return data;
         })
         .error(function(data) {
           return data;
         });
}]);
