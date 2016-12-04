app.controller('BodyController', ['$scope', '$location', 'authentication', 'data', function($scope, $location, authentication, data) {
    
    data.getProviders().success(function(data) {
       $scope.providers = data;
    });
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
    $scope.bookAppointment = function() {
        data.bookAppointment($scope.currentUser._id, $scope.chosenProvider, $scope.chosenDate).success(function() {
            $location.path('/Redirect');
        });
    };
}]);