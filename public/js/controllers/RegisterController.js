app.controller('RegisterController', ['$scope', '$location', 'authentication', function($scope, $location, authentication) {
    
    $scope.credentials = {
        name : "",
        email : "",
        password : "",
        serviceProvider: false
    };
    
    $scope.onSubmit = function () {
        authentication
        .register($scope.credentials)
        .error(function(err){
            alert(err);
        })
        .then(function(){
            $scope.$parent.register = false;
            $scope.$parent.isLoggedIn = authentication.isLoggedIn();
            $scope.$parent.currentUser = authentication.currentUser();
            $location.path('/Redirect');
        });
    };
}]);