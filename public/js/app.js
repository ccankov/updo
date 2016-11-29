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
      controller: 'LoginController',
      templateUrl: 'views/login.html'
    })
    .when('/User/:id', {
      controller: 'UserController',
      templateUrl: 'views/user.html'
    })
    .otherwise({
      redirectTo: '/'
    });
});

// Register environment in AngularJS as constant
app.constant('__env', env);