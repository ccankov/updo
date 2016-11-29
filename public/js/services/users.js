app.factory('users', ['$http', '__env', function($http, __env) {
  return $http.get(__env.apiUrl + '/api/Users')
         .success(function(data) {
           return data;
         })
         .error(function(data) {
           return data;
         });
}]);
