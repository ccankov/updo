app.service('data', ['$http', 'authentication', function($http, authentication) {
    
    var getAppointments = function (id) {
        return $http({
            method: 'GET',
            headers: {
                Authorization: 'Bearer '+ authentication.getToken()
            },
            url: ('/api/Appointments/' + id),
        });
    };
    
    var getAppointmentsForProvider = function (id) {
        return $http({
            method: 'GET',
            headers: {
                Authorization: 'Bearer '+ authentication.getToken()
            },
            url: ('/api/AppointmentsForProvider/' + id),
        });
    };
    
    var appointment = function(id, method) {
        return $http({
            method: method,
            headers: {
                Authorization: 'Bearer '+ authentication.getToken()
            },
            url: ('/api/Appointment/' + id),
        });
    };

    return {
        
        appointment: appointment,
        getAppointments : getAppointments,
        getAppointmentsForProvider : getAppointmentsForProvider
    };
    
}]);