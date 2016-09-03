/* Header */
// Load modules
const express = require("express");
const app = express();
const fs = require("fs");
//const $ = require("jquery");

// Global constants & variables
const ENVPORT = process.env.PORT;
const ENVIP = process.env.IP;
const dirname = "data";
var users = JSON.parse(fs.readFileSync(dirname+'/'+'users.json','utf8'));
var appointments = JSON.parse(fs.readFileSync(dirname+'/'+'appointments.json','utf8'));

/* Object Constructors */
// User
function User(id, name, serviceProvider) {
    this.id = id;
    this.Name = name;
    this.serviceProvider = serviceProvider;
}
// Appointment
function Appointment(id, userID, providerID, dateTime, status) {
    this.id = id;
    this.userID = userID;
    this.providerID = providerID;
    this.dateTime = dateTime;
    this.status = status;
}

/* Web API Parameters */
// Handle error checking for apptID parameter
app.param('apptID', function(req,res,next,apptID){
    req.params.apptID = Number(apptID);
    if (!req.params.apptID || !appointments[req.params.apptID-1]) { return res.status(400).send("Parameter apptID must be a valid user id."); }
    next();
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
    req.params.providerID = Number(providerID);
    if (!req.params.providerID || !users[req.params.providerID-1]) { return res.status(400).send("Parameter providerID must be a valid user id."); }
    if (!users[req.params.providerID-1].serviceProvider) { return res.status(400).send("The user with the specified providerID is not a service provider."); }
    next();
});

// Handle error checking for serviceProvider parameter
app.param('serviceProvider', function(req,res,next,serviceProvider){
    if (["1", "0", "true", "false"].indexOf(serviceProvider) < 0) { return res.status(400).send("Parameter serviceProvider must be a valid boolean."); }
    next();
});

// Handle error checking for userID parameter
app.param('userID', function(req,res,next,userID){
    req.params.userID = Number(userID);
    if (!req.params.userID || !users[req.params.userID-1]) { return res.status(400).send("Parameter userID must be a valid user id."); }
    next();
});

/* Web API methods */
// Add a new user with unique id; takes parameters name & serviceProvider
app.get('/api/addUser/:name/:serviceProvider', function(req, res) {
    var user = new User(users.length+1,req.params.name, req.params.serviceProvider === "true" || req.params.serviceProvider === "1" ? true : false);
    users[users.length] = user;
    fs.writeFile(dirname + "/"+"users.json",JSON.stringify(users),'utf8', function(err){
      if (err) { return console.log("ERROR: Unable to commit new user to database.");}
    });
    res.json(user);
});

// Book an appointment with specified user; takes parameters userID, providerID & dateTime
app.get('/api/bookAppt/:userID/:providerID/:dateTime', function(req, res) {
    var appointment = new Appointment(appointments.length+1,req.params.userID,req.params.providerID,req.params.dateTime,false);
    appointments[appointments.length] = appointment;  
    fs.writeFile(dirname + "/"+"appointments.json",JSON.stringify(appointments),'utf8', function(err){
        if (err) {return console.log("Unable to commit new user to database.");}
    });
    res.json(appointment);
});

// Confirm an appointment; takes parameter apptID
app.get('/api/confirmAppt/:apptID', function(req, res) {
    appointments[req.params.apptID-1].status = true;
    fs.writeFile(dirname + "/"+"appointments.json",JSON.stringify(appointments),'utf8', function(err){
        if (err) { return console.log("Unable to save confirmed appointment.");}
    });
    res.json(appointments[req.params.apptID-1]);
});

// Delete an appointment; takes parameter apptID
app.get('/api/deleteAppt/:apptID', function(req, res) {
    appointments[req.params.apptID-1] = {};
    fs.writeFile(dirname + "/"+"appointments.json",JSON.stringify(appointments),'utf8', function(err){
        if (err) {return console.log("Unable to delete appointment.");}
    });
    res.json(appointments[req.params.apptID-1]);
});

// Delete user with specified id; takes parameter userID
app.get('/api/deleteUser/:userID', function(req, res) {
    users[req.params.userID-1] = {};
    fs.writeFile(dirname + "/"+"users.json",JSON.stringify(users),'utf8', function(err){
        if (err) {return console.log("Unable delete user.");}
    });
    res.json(users[req.params.userID-1]);
});

// List details of appointment with specified id; takes parameter apptID
app.get('/api/getAppt/:apptID', function (req, res) {
      res.json(users[req.params.apptID-1]);
});

// List details of user with specified id; takes parameter userID
app.get('/api/getUser/:userID', function (req, res) {
      res.json(users[req.params.userID-1]);
});

// List all appointments
app.get('/api/listAppts', function(req, res) {
        res.json(appointments);
});

// List all users
app.get('/api/listUsers', function(req, res) {
        res.json(users);
});

// Catch call
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
