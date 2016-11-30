app.controller('UserController', ['$scope', 'user', 'appointments', '$routeParams', function($scope, user, appointments, $routeParams) {
    user($routeParams.id).success(function(data) {
        $scope.curUser = data;
    });
    appointments($routeParams.id).success(function(data) {
        $scope.appointments = data;
    });
    /*$scope.cancelAppt = function(index) {
        var id = appointments[index]._id;
        
        $http.;
    };*/
}]);