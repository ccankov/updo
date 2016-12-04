var env = {};

// Import variables if present (from env.js)
if(window){  
  Object.assign(env, window.__env);
}

// Angular app
var app = angular.module('Updo', ['ngRoute']);
app.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      controller: 'UserController',
      templateUrl: 'views/user.html'
    })
    .when('/Provider', {
      controller: 'ProviderController',
      templateUrl: 'views/provider.html'
    })
    .otherwise({
      redirectTo: '/'
    });
});
app.run(['$rootScope', '$location', 'authentication', function($rootScope, $location, authentication) {
    $rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute) {
        if ($location.path() === '/Provider' && !authentication.isLoggedIn()) {
            $location.path('/');
        }
    });
}]);

// Register environment in AngularJS as constant
app.constant('__env', env);