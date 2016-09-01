/* Header */
// Load modules
const express = require("express");
const app = express();
const fs = require("fs");
//const $ = require("jquery");

// Port & IP Constants
const ENVPORT = process.env.PORT;
const ENVIP = process.env.IP;
const dirname = "data";
var users = JSON.parse(fs.readFileSync(dirname+'/'+'users.json','utf8'));

/* Object Constructors */
// User
function User(id, name, sp) {
    this.id = id;
    this.Name = name;
    this.serviceProvider = sp;
}
// Appointment
function Appointment(id, consumerID, providerID, dateTime) {
    this.id = id;
    this.consumerID = consumerID;
    this.providerID = providerID;
    this.dateTime = dateTime;
}

/* Web API methods */
// Add a new user with unique id; takes parameters name & sp
app.get('/addUser/:name/:sp', function(req, res) {
    fs.readFile( dirname + "/" + "users.json", 'utf8', function (err, data) {
      if (err) { res.end("Unable to read user data from disk.") }
      data = JSON.parse( data );
      var user = new User(data.length+1,req.params.name, req.params.sp === "false" || req.params.sp === "0" ? false :  true);
      data[data.length] = user;
      fs.writeFile(dirname + "/"+"users.json",JSON.stringify(data),'utf8', function(err){
          if (err) { return res.end("Unable to commit new user to database.");}
      });
      users = data;
      console.log( data );
      res.end( JSON.stringify(user));
   });
});

// Book an appointment with specified user; takes parameters consumerID, providerID & dateTime
app.get('/bookAppt/:consumerID/:providerID/:dateTime', function(req, res) {
    fs.readFile( dirname + "/" + "appointments.json", 'utf8', function (err, data) {
      if (err) { return res.end("Unable to read user data from disk."); }
      var timestamp = Date.parse(req.params.dateTime);
      if (!users[Number(req.params.providerID)-1].serviceProvider) {return res.end("Requested user is not a valid service provider.");}
      if (isNaN(timestamp)) { return res.end("Invalid date parameter."); }
      var dateTime = new Date(timestamp);
      data = JSON.parse( data );
      data[data.length] = new Appointment(data.length+1,req.params.consumerID,req.params.providerID,dateTime);
      
      fs.writeFile(dirname + "/"+"appointments.json",JSON.stringify(data),'utf8', function(err){
          if (err) {res.end("Unable to commit new user to database.");}
      });
      console.log( data );
      res.end( JSON.stringify(data));
   });
});

// Delete user with specified id; takes parameter id
app.get('/deleteUser/:id', function(req, res) {
    fs.readFile( dirname + "/" + "users.json", 'utf8', function (err, data) {
      if (err) { res.end("Unable to read user data from disk.") }
      data = JSON.parse( data );
      data[req.params.id-1] = {};
      fs.writeFile(dirname + "/"+"users.json",JSON.stringify(data),'utf8', function(err){
          if (err) {return res.end("Unable to commit new user to database.");}
      });
      users = data;
      console.log( data );
      res.end( JSON.stringify({}));
   });
});

// List all users
app.get('/listUsers', function(req, res) {
    fs.readFile(dirname + "/" + "users.json", 'utf8',function(err, data) {
        if (err) { return res.end(err); }
        console.log(data);
        res.end(data);
    });
});

// List details of user with specified id; takes parameter id
app.get('/:id', function (req, res) {
   fs.readFile( dirname + "/" + "users.json", 'utf8', function (err, data) {
      if (err) { return res.end(err); }
      var users = JSON.parse( data );
      var user = users[req.params.id-1];
      console.log( user );
      res.end( JSON.stringify(user));
   });
});

/* Server */
// Initialize web server
var server = app.listen(ENVPORT, function() {
   var host = server.address().address;
   var port = server.address().port;
   
   console.log("Example app listening at http://%s:%s", host, port);
});