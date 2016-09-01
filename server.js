/* Header */
// Load modules
const express = require("express");
const app = express();
const fs = require("fs");
//const $ = require("jquery");

// Port & IP Constants
const ENVPORT = 8080;
const ENVIP = "127.0.0.1";
const dirname = "data";
var users = JSON.parse(fs.readFileSync(dirname+'/'+'users.json','utf8'));
var appointments = JSON.parse(fs.readFileSync(dirname+'/'+'appointments.json','utf8'));

/* Object Constructors */
// User
function User(id, name, sp) {
    this.id = id;
    this.Name = name;
    this.serviceProvider = sp;
}
// Appointment
function Appointment(id, consumerID, providerID, dateTime, status) {
    this.id = id;
    this.consumerID = consumerID;
    this.providerID = providerID;
    this.dateTime = dateTime;
    this.status = status;
}

/* Web API methods */
// Add a new user with unique id; takes parameters name & sp
app.get('/addUser/:name/:sp', function(req, res) {
    var user = new User(users.length+1,req.params.name, req.params.sp === "false" || req.params.sp === "0" ? false :  true);
    users[users.length] = user;
    fs.writeFile(dirname + "/"+"users.json",JSON.stringify(users),'utf8', function(err){
      if (err) { return res.end("Unable to commit new user to database.");}
    });
    console.log( user );
    res.end( JSON.stringify(user));
});

// Book an appointment with specified user; takes parameters consumerID, providerID & dateTime
app.get('/bookAppt/:consumerID/:providerID/:dateTime', function(req, res) {
    var timestamp = Date.parse(req.params.dateTime);
    if (!users[Number(req.params.providerID)-1].serviceProvider) {return res.end("Requested user is not a valid service provider.");}
    if (isNaN(timestamp)) { return res.end("Invalid date parameter."); }
    var dateTime = new Date(timestamp);
    var appointment = new Appointment(appointments.length+1,req.params.consumerID,req.params.providerID,dateTime,false);
    appointments[appointments.length] = appointment;  
    fs.writeFile(dirname + "/"+"appointments.json",JSON.stringify(appointments),'utf8', function(err){
        if (err) {res.end("Unable to commit new user to database.");}
    });
    console.log( appointment );
    res.end( JSON.stringify(appointment));
});

// Confirm an appointment; takes parameter id
app.get('/confirmAppt/:id', function(req, res) {
    if (!appointments[Number(req.params.id) - 1]) { return res.end("Invalid appointment id."); }
    var appointment = appointments[req.params.id-1];
    appointment.status = true;
    appointments[appointment.id-1] = appointment;
    
    fs.writeFile(dirname + "/"+"appointments.json",JSON.stringify(appointments),'utf8', function(err){
        if (err) {res.end("Unable to commit new user to database.");}
    });
    console.log( appointment );
    res.end( JSON.stringify(appointment));
});

// Delete an appointment; takes parameter id
app.get('/deleteAppt/:id', function(req, res) {
    if (!appointments[Number(req.params.id)-1]) { return res.end("Invalid appointment id."); }
    var appointment = appointments[req.params.id-1];
    appointment = {};
    appointments[req.params.id-1] = appointment;
    
    fs.writeFile(dirname + "/"+"appointments.json",JSON.stringify(appointments),'utf8', function(err){
        if (err) {res.end("Unable to commit new user to database.");}
    });
    console.log( appointment );
    res.end( JSON.stringify(appointment));
});

// Delete user with specified id; takes parameter id
app.get('/deleteUser/:id', function(req, res) {
    users[req.params.id-1] = {};
    fs.writeFile(dirname + "/"+"users.json",JSON.stringify(users),'utf8', function(err){
        if (err) {return res.end("Unable to commit new user to database.");}
    });
    console.log( JSON.stringify({}) );
    res.end( JSON.stringify({}));
});

// List all users
app.get('/listUsers', function(req, res) {
        console.log(JSON.stringify(users));
        res.end(JSON.stringify(users));
});

// List all appointments
app.get('/listAppts', function(req, res) {
        console.log(JSON.stringify(appointments));
        res.end(JSON.stringify(appointments));
});

// List details of user with specified id; takes parameter id
app.get('/:id', function (req, res) {
      var user = users[req.params.id-1];
      console.log( user );
      res.end( JSON.stringify(user));
});

/* Server */
// Initialize web server
var server = app.listen(ENVPORT, function() {
   var host = server.address().address;
   var port = server.address().port;
   
   console.log("Example app listening at http://%s:%s", host, port);
});