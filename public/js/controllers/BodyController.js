app.controller('BodyController', ['$scope', '$location', 'authentication', function($scope, $location, authentication) {
    
    $scope.isLoggedIn = authentication.isLoggedIn();
    $scope.currentUser = authentication.currentUser();
    $scope.route = $location.url();
    $scope.register = false;
    $scope.login = false;
    $scope.logout = function() {
            authentication.logout();
            $scope.isLoggedIn = authentication.isLoggedIn();
            $scope.currentUser = authentication.currentUser();
        };
}]);