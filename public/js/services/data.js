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
    
    var getProviders = function () {
        return $http({
            method: 'GET',
            headers: {
                Authorization: 'Bearer '+ authentication.getToken()
            },
            url: ('/api/Providers/'),
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
    
    var bookAppointment = function(userID, providerID, dateTime) {
        return $http({
            method: 'POST',
            headers: {
                Authorization: 'Bearer '+ authentication.getToken()
            },
            url: ('/api/Appointment/' + userID + '/' + providerID + '/' + dateTime),
        });
    };

    return {
        
        appointment: appointment,
        bookAppointment: bookAppointment,
        getAppointments : getAppointments,
        getAppointmentsForProvider : getAppointmentsForProvider,
        getProviders : getProviders
    };
    
}]);