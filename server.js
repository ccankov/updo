/* Object Constructors */
// User
function User(id, name, sp) {
    this.id = id;
    this.Name = name;
    this.serviceProvider = sp;
}
//

/* Main */
// Load modules
const express = require("express");
const app = express();
const fs = require("fs");
const $ = require("jquery");

// Port & IP Constants
const ENVPORT = process.env.PORT;
const ENVIP = process.env.IP;
const dirname = "data";

app.get('/listUsers', function(req, res) {
    fs.readFile(dirname + "/" + "users.json", 'utf8',function(err, data) {
        if (err) { return console.log(err) }
        console.log(data);
        res.end(data);
    });
});

app.get('/addUser/:name/:sp', function(req, res) {
    fs.readFile( dirname + "/" + "users.json", 'utf8', function (err, data) {
      if (err) { res.end("Unable to read user data from disk.") }
      data = JSON.parse( data );
      data[data.length] = new User(data.length+1,req.params.name, req.params.sp === "false" || req.params.sp === "0" ? false :  true);
      fs.writeFile(dirname + "/"+"users.json",JSON.stringify(data),'utf8', function(err){
          if (err) {res.end("Unable to commit new user to database.");}
      });
      console.log( data );
      res.end( JSON.stringify(data));
   });
});

app.get('/deleteUser/:id', function(req, res) {
    fs.readFile( dirname + "/" + "users.json", 'utf8', function (err, data) {
      if (err) { res.end("Unable to read user data from disk.") }
      data = JSON.parse( data );
      data[req.params.id-1] = {};
      fs.writeFile(dirname + "/"+"users.json",JSON.stringify(data),'utf8', function(err){
          if (err) {res.end("Unable to commit new user to database.");}
      });
      console.log( data );
      res.end( JSON.stringify(data));
   });
});


app.get('/:id', function (req, res) {
   // First read existing users.
   fs.readFile( dirname + "/" + "users.json", 'utf8', function (err, data) {
      if (err) { return console.log(err) }
      var users = JSON.parse( data );
      var user = users[req.params.id-1];
      console.log( user );
      res.end( JSON.stringify(user));
   });
});

var server = app.listen(ENVPORT, function() {
   var host = server.address().address;
   var port = server.address().port;
   
   console.log("Example app listening at http://%s:%s", host, port);
});