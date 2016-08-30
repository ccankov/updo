/* Object Constructors */
// User
function User(id, name, sp) {
    this.id = id;
    this.Name = name;
    this.serviceProvider = sp;
}
//

/* Main */
// Port & IP Constants
const ENVPORT = process.env.PORT;
const ENVIP = process.env.IP;
const dirname = "data";

// Load modules
const express = require("express");
const app = express();
const fs = require("fs");

app.get('/listUsers', function(req, res) {
    fs.readFile(dirname + "/" + "users.json", 'utf8',function(err, data) {
        console.log(data);
        res.end(data);
    });
});

app.get('/:id', function (req, res) {
   // First read existing users.
   fs.readFile( dirname + "/" + "users.json", 'utf8', function (err, data) {
      var users = JSON.parse( data );
      var user = users["user" + req.params.id];
      console.log( user );
      res.end( JSON.stringify(user));
   });
});

var server = app.listen(ENVPORT, function() {
   var host = server.address().address;
   var port = server.address().port;
   
   console.log("Example app listening at http://%s:%s", host, port);
});