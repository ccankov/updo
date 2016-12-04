app.controller('LoginController', ['$scope', '$location', 'authentication', function($scope, $location, authentication) {
    
    $scope.credentials = {
        email : "",
        password : ""
    };
    
    $scope.onSubmit = function () {
        authentication
        .login($scope.credentials)
        .error(function(err){
            alert(err);
        })
        .then(function(){
            $scope.$parent.login = false;
            $scope.$parent.isLoggedIn = authentication.isLoggedIn();
            $scope.$parent.currentUser = authentication.currentUser();
            $location.path('/Redirect');
        });
    };
}]);