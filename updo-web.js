/* Header */

    // Load modules
    const express = require("express");
    const app = express();
    
    // Use static files (.JS, .CSS, .JPG, etc.) in public directory
    app.use(express.static('public'));
    
    // Global constants & variables
    const ENVPORT = 8080;
    const ENVIP = "127.0.0.1";

/* Frontend AngularJS-based single page website */
    // Always respond with index.html
    app.get('*', function(req, res) {
        res.sendFile('index.html', { root:"public" });
    });

/* Host site */
    // Initialize web server
    var web = app.listen(ENVPORT, function() {
       var host = web.address().address;
       var port = web.address().port;
       
       console.log("Booking app frontend listening at http://%s:%s", host, port);
    });