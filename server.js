/* Header */

    // Load modules
    const express = require("express");
    const app = express();
    const mongoose = require('mongoose');
    mongoose.connect('mongodb://localhost/updo');
    
    // Global constants & variables
    const ENVPORT = 8081;
    const ENVIP = "127.0.0.1";
    const dbErr = "MongoDB Error: ";

/* MongoDB Schemas */
    var userSchema = new mongoose.Schema({
        name: String,
        serviceProvider: Boolean
    });
    
    var apptSchema = new mongoose.Schema({
        userID: String,
        providerID: String,
        dateTime: { type: Date, default: Date.now },
        status: Boolean
    });
    
/* MongoDB Models */
    var User = mongoose.model('User', userSchema);
    var Appointment = mongoose.model('Appointment', apptSchema);

/* Web API Parameters */
    // Handle error checking for apptID parameter
    app.param('apptID', function(req,res,next,apptID){
        Appointment.findById(apptID, '_id userID providerID dateTime status', function (err, data) {
            if (err) { return res.status(400).send('Unable to find appointment with ID ' + apptID); }
            req.params.appt = data;
            next();
        });
    });
    
    // Handle error checking for userID parameter
    app.param('userID', function(req,res,next,userID){
        User.findById(userID, '_id name serviceProvider', function (err, data) {
            if (err) { return res.status(400).send('Unable to find user with ID ' + userID); }
            req.params.user = data;
            next();
        });
    });
    
    // Handle error checking for dateTime parameter
    app.param('dateTime', function(req,res,next,dateTime){
        dateTime = Date.parse(dateTime);
        if (isNaN(dateTime)) { return res.status(400).send("Parameter dateTime is not in a valid format."); }
        req.params.dateTime = new Date(dateTime);
        next();
    });
    
    // Handle error checking for id parameter
    app.param('name', function(req,res,next,name){
        var minLength = 3, maxLength = 10;
        if (name.length < minLength || name.length > maxLength) { return res.status(400).send("Parameter name must be between "+minLength+" - "+maxLength+" characters long."); }
        next();
    });
    
    // Handle error checking for providerID parameter
    app.param('providerID', function(req,res,next,providerID){
        User.findById(providerID, '_id name serviceProvider', function (err, data) {
            if (err) { return res.status(400).send('Unable to find user with ID ' + providerID); }
            else if (!data.serviceProvider) { res.status(400).send('The specified service provider with ID ' + providerID + ' is not a registered service provider.'); }
            req.params.provider = data;
            next();
        });
    });
    
    // Handle error checking for serviceProvider parameter
    app.param('serviceProvider', function(req,res,next,serviceProvider){
        if (["1", "0", "true", "false"].indexOf(serviceProvider) < 0) { return res.status(400).send("Parameter serviceProvider must be a valid boolean."); }
        next();
    });

/* Web API methods */
    // Add a new user with unique id; takes parameters name & serviceProvider
    app.get('/api/addUser/:name/:serviceProvider', function(req, res) {
        var user = new User( { name: req.params.name, serviceProvider: (req.params.serviceProvider === "true" || req.params.serviceProvider === "1" ? true : false) } );
        user.save(function(err) { 
            if (err){ return res.send(dbErr + "Unable to commit new user to database: " + err); }
            res.json(user);
        });
    });
    
    // Book an appointment with specified user; takes parameters userID, providerID & dateTime
    app.get('/api/bookAppt/:userID/:providerID/:dateTime', function(req, res) {
        var appointment = new Appointment({ userID: req.params.userID, providerID: req.params.providerID, dateTime: req.params.dateTime, status: false });
        appointment.save(function(err) { 
            if (err){ return res.send(dbErr + "Unable to commit new appointment to database: " + err); } 
            res.json(appointment);
        });
    });
    
    // Confirm an appointment; takes parameter apptID
    app.get('/api/confirmAppt/:apptID', function(req, res) {
        Appointment.findByIdAndUpdate(req.params.apptID, { status: true }, function(err, data) {
            if (err) { return res.send(dbErr + "Unable to confirm appointment with ID " + req.params.apptID + " : " + err); }
            data.status = true;
            res.json(data);
        });
    });
    
    // Delete an appointment; takes parameter apptID
    app.get('/api/deleteAppt/:apptID', function(req, res) {
        Appointment.findByIdAndRemove(req.params.apptID, function(err) {
            if (err) { return res.send(dbErr + "Unable to delete appointment with ID " + req.params.apptID + " : " + err); }
            res.json({});
        });
    });
    
    // Delete user with specified id; takes parameter userID
    app.get('/api/deleteUser/:userID', function(req, res) {
        User.findByIdAndRemove(req.params.userID, function(err) {
            if (err) { return res.send(dbErr + "Unable to delete user with ID " + req.params.apptID + " : " + err); }
            res.json({});
        });
    });
    
    // List details of appointment with specified id; takes parameter apptID
    app.get('/api/getAppt/:apptID', function (req, res) {
        Appointment.findById(req.params.apptID, function (err, data) {
            if (err) { return res.send(dbErr + "Unable to get appointment with ID " + req.params.apptID + " : " + err); }
            res.json(data);
        });
    });
    
    // List details of user with specified id; takes parameter userID
    app.get('/api/getUser/:userID', function (req, res) {
        User.findById(req.params.userID, function (err, data) {
            if (err) { return res.send(dbErr + "Unable to get user with ID " + req.params.userID + " : " + err); }
            res.json(data);
        });
    });
    
    // List all appointments
    app.get('/api/listAppts', function(req, res) {
        Appointment.find({}, function (err, data) {
            if (err) { return res.send(dbErr + "Unable to get list of appointments : " + err); }
            res.json(data);
        });
    });
    
    // List all users
    app.get('/api/listUsers', function(req, res) {
        User.find({}, function (err, data) {
            if (err) { return res.send(dbErr + "Unable to get list of users : " + err); }
            res.json(data);
        });
    });
    
    // Catch all - documentation
    app.get('/api/*', function(req, res) {
        res.send("Invalid Web API call. <br /><br />\
        GET - /api/*<br /><br />\
        &nbsp&nbsp&nbsp&nbspPrints the Web API documentation.<br /><br />\
        GET - /api/addUser/:name/:serviceProvider&nbsp&nbsp&nbsp&nbsp[string name, bool serviceProvider]<br /><br />\
        &nbsp&nbsp&nbsp&nbspAdd a new User with specified name and use specified bool to set if they are a service provider.<br />\
        &nbsp&nbsp&nbsp&nbspUser IDs increment by 1 and are never reused.<br /><br />\
        GET - /api/bookAppt/:userID/:providerID/:dateTime&nbsp&nbsp&nbsp&nbsp[int userID, int providerID, DateTime dateTime]<br /><br />\
        &nbsp&nbsp&nbsp&nbspCreate a new Appointment between user with specified ID and provider with specified ID at the specified dateTime.<br />\
        &nbsp&nbsp&nbsp&nbspAppointment IDs increment by 1 and are never reused. Newly created appointments have a status of false (unconfirmed).<br /><br />\
        GET - /api/confirmAppt/:apptID&nbsp&nbsp&nbsp&nbsp[int apptID]<br /><br />\
        &nbsp&nbsp&nbsp&nbspConfirm the Appointment with the specified appointment ID by changing its status from false to true.<br /><br />\
        GET - /api/deleteAppt/:apptID&nbsp&nbsp&nbsp&nbsp[int apptID]<br /><br />\
        &nbsp&nbsp&nbsp&nbspDelete the Appointment with the specified appointment ID.<br /><br />\
        GET - /api/deleteUser/:userID&nbsp&nbsp&nbsp&nbsp[int userID]<br /><br />\
        &nbsp&nbsp&nbsp&nbspDelete the User with the specified user ID.<br /><br />\
        GET - /api/getAppt/:apptID&nbsp&nbsp&nbsp&nbsp[int apptID]<br /><br />\
        &nbsp&nbsp&nbsp&nbspReturns the Appointment with the specified appointment ID.<br /><br />\
        GET - /api/getUser/:userID&nbsp&nbsp&nbsp&nbsp[int userID]<br /><br />\
        &nbsp&nbsp&nbsp&nbspReturns the User with the specified user ID.<br /><br />\
        GET - /api/listAppts<br /><br />\
        &nbsp&nbsp&nbsp&nbspReturns the array of all Appointment objects.<br /><br />\
        GET - /api/listUsers<br /><br />\
        &nbsp&nbsp&nbsp&nbspReturns the array of all User objects.");
    });

/* Server */
    // Initialize web server
    var server = app.listen(ENVPORT, function() {
       var host = server.address().address;
       var port = server.address().port;
       
       console.log("Booking app listening at http://%s:%s", host, port);
    });