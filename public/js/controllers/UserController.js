app.controller('UserController', ['$scope', 'user', 'appointment', 'appointments', '$routeParams', function($scope, user, appointment, appointments, $routeParams) {
    user($routeParams.id).success(function(data) {
        $scope.curUser = data;
    });
    appointments($routeParams.id).success(function(data) {
        $scope.appointmentsUpcoming = data.filter(function(value) {
            return Date.parse(value.dateTime) > Date.now();
        });
        $scope.appointmentsPast = data.filter(function(value) {
            return Date.parse(value.dateTime) <= Date.now();
        });
    });
    $scope.deleteAppt = function(index) {
        var appt = $scope.appointmentsUpcoming[index];
        
        appointment(appt._id, 'DELETE').success(function() {
           $scope.appointmentsUpcoming.splice(index, 1);
        });
    };
    $scope.confirmAppt = function(index) {
        var appt = $scope.appointmentsUpcoming[index];
        
        appointment(appt._id, 'PATCH').success(function() {
           $scope.appointmentsUpcoming[index].status = true;
        });
    };
}]);