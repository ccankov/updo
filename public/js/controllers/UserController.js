app.controller('UserController', ['$scope', 'user', '$routeParams', function($scope, user, $routeParams) {
    user($routeParams.id).success(function(data) {
        $scope.curUser = data;
    });
}]);