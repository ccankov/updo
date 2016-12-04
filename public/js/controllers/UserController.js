app.controller('UserController', ['$scope', 'data', function($scope, data) {
    $scope.currentUser = $scope.$parent.currentUser;
    
    if ($scope.currentUser) {
        data.getAppointments($scope.currentUser._id).success(function(data) {
            $scope.appointmentsUpcoming = data.filter(function(value) {
                return Date.parse(value.dateTime) > Date.now();
            });
            $scope.appointmentsPast = data.filter(function(value) {
                return Date.parse(value.dateTime) <= Date.now();
            });
        });
        $scope.deleteAppt = function(index) {
            var appt = $scope.appointmentsUpcoming[index];
            
            data.appointment(appt._id, 'DELETE').success(function() {
               $scope.appointmentsUpcoming.splice(index, 1);
            });
        };
        $scope.confirmAppt = function(index) {
            var appt = $scope.appointmentsUpcoming[index];
            
            data.appointment(appt._id, 'PATCH').success(function() {
               $scope.appointmentsUpcoming[index].status = true;
            });
        };
    }
}]);