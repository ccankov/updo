/* Header */
    // Load modules
    const config = require('./config/config.js');
    const crypto = require('crypto');
    const jwt = require('jsonwebtoken');
    const express = require("express");
    const passport = require('passport');
    const bodyParser = require('body-parser');
    const multer = require('multer'); // v1.0.5
    const upload = multer(); // for parsing multipart/form-data
    const app = express();
    var jwte = require('express-jwt');
    var auth = jwte({
        secret: config.secret,
        userProperty: 'payload'
    });
    const mongoose = require('mongoose');
    mongoose.connect('mongodb://localhost/updo');
    
    // Use static files (.JS, .CSS, .JPG, etc.) in public directory
    app.use(express.static('public'));
    
    // Global constants & variables
    const ENVPORT = 8081;
    const ENVIP = "127.0.0.1";
    const dbErr = "MongoDB Error: ";

/* MongoDB Schemas */
    // Define the schema or stucture of data
    var userSchema = new mongoose.Schema({
        email: {
            type: String,
            unique: true,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        serviceProvider: Boolean,
        hash: String,
        salt: String
    });
    // Set user password: Define user salt and hash based on provided password
    userSchema.methods.setPassword = function(password){
        this.salt = crypto.randomBytes(16).toString('hex');
        this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    };
    // Validate password: Compare provided password against salt and hash
    userSchema.methods.validPassword = function(password) {
        var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
        return this.hash === hash;
    };
    // Generate auth token for user
    userSchema.methods.generateJwt = function() {
        var expiry = new Date();
        expiry.setDate(expiry.getDate() + 7);
    
         return jwt.sign({
            _id: this._id,
            email: this.email,
            name: this.name,
            serviceProvider: this.serviceProvider,
            exp: parseInt(expiry.getTime() / 1000),
        }, config.secret);
    };
    
    var apptSchema = new mongoose.Schema({
        userID: [{type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        providerID: [{type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        dateTime: { type: Date, default: Date.now },
        status: Boolean
    });

/* MongoDB Models */
    // Used to perform query operations against these db schemas
    var User = mongoose.model('User', userSchema);
    var Appointment = mongoose.model('Appointment', apptSchema);

/* Web API Middleware */
    // Passport configuration required after User model is defined
    require('./config/passport.js');
    // Passport initialization
    app.use(passport.initialize());
    
    // Make sure protected paths have a valid user ID
    var validateID = function(req, res, next) {
        // If no user ID exists in the JWT return a 400
        if (!req.payload._id) { return res.status(400).send("Unauthorized: Private profile."); }
        next();
    };
    
    // Parse JSON objects & application/x-www-form-urlencoded
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

/* Web API Parameters */
    // Handle error checking for apptID parameter
    app.param('apptID', function(req,res,next,apptID){
        Appointment.findById(apptID, '_id userID providerID dateTime status', function (err, data) {
            if (err) { return res.status(500).send('Unable to find appointment with ID ' + apptID); }
            req.params.appt = data;
            next();
        });
    });
    
    // Handle error checking for userID parameter
    app.param('userID', function(req,res,next,userID){
        User.findById(userID, '_id name serviceProvider', function (err, data) {
            if (err) { return res.status(500).send('Unable to find user with ID ' + userID); }
            req.params.user = data;
            next();
        });
    });
    
    // Handle error checking for dateTime parameter
    app.param('dateTime', function(req,res,next,dateTime){
        var tempDate = Date.parse(dateTime);
        if (isNaN(tempDate)) { tempDate = Number(dateTime) * 1000; }
        if (isNaN(tempDate)) { return res.status(400).send("Parameter dateTime is not in a valid format."); }
        req.params.dateTime = new Date(tempDate);
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
            if (err) { return res.status(500).send('Unable to find user with ID ' + providerID); }
            else if (!data.serviceProvider) { return res.status(400).send('The specified service provider with ID ' + providerID + ' is not a registered service provider.'); }
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
    // Register a new user, requires name, password, serviceProvider, and email in req body
    app.post('/api/User', upload.array(), function(req, res) {
        if (req.body.name && req.body.email && req.body.password) {
            var user = new User();
            
            user.name = req.body.name;
            user.email = req.body.email;
            user.serviceProvider = req.body.serviceProvider;
            
            user.setPassword(req.body.password);
            
            user.save(function(err) {
                if (err) { return res.status(500).send(dbErr + "Unable to commit new user to database: " + err); }
                
                var token;
                token = user.generateJwt();
                res.json({
                    "token" : token
                });
            });
        }
        else { return res.status(400).send('Invalid user registration request.'); }
    });
    
    // Login an existing user, requires 
    app.post('/api/login', upload.array(), function(req, res) {
        passport.authenticate('local', function(err, user, info){
            var token;
        
            // If Passport throws/catches an error
            if (err) { return res.status(401).send("Access denied: " + err); }
        
            // If a user is found
            if(user){
                token = user.generateJwt();
                res.json({ "token" : token });
            } else {
                // If user is not found
                res.status(400).send("Invalid user: " + info);
            }
        })(req, res);
    });
    
    // Book an appointment with specified user; takes parameters userID, providerID & dateTime
    app.post('/api/Appointment/:userID/:providerID/:dateTime', function(req, res) {
        var appointment = new Appointment({ userID: req.params.userID, providerID: req.params.providerID, dateTime: req.params.dateTime, status: false });
        appointment.save(function(err) { 
            if (err){ return res.status(500).send(dbErr + "Unable to commit new appointment to database: " + err); }
            res.json(appointment);
        });
    });

    // Confirm an appointment; takes parameter apptID
    app.patch('/api/Appointment/:apptID', auth, validateID, function(req, res) {
        Appointment.findByIdAndUpdate(req.params.apptID, { status: true }, function(err, data) {
            if (err) { return res.status(500).send(dbErr + "Unable to confirm appointment with ID " + req.params.apptID + " : " + err); }
            data.status = true;
            res.json(data);
        });
    });
    
    // Delete an appointment; takes parameter apptID
    app.delete('/api/Appointment/:apptID', auth, validateID, function(req, res) {
        Appointment.findByIdAndRemove(req.params.apptID, function(err) {
            if (err) { return res.status(500).send(dbErr + "Unable to delete appointment with ID " + req.params.apptID + " : " + err); }
            res.json({});
        });
    });
    
    // Delete user with specified id; takes parameter userID
    app.delete('/api/User/:userID', auth, validateID, function(req, res) {
        if (req.payload._id !== req.params.userID){ return res.status(401).send("Unauthorized: Cannot delete private user."); }
        User.findByIdAndRemove(req.params.userID, function(err) {
            if (err) { return res.status(500).send(dbErr + "Unable to delete user with ID " + req.params.userID + " : " + err); }
            res.json({});
        });
    });
    
    // List details of appointment with specified id; takes parameter apptID
    app.get('/api/Appointment/:apptID', auth, validateID, function (req, res) {
        if (req.payload._id !== req.params.appt.userID){ return res.status(401).send("Unauthorized: Cannot retrieve appointments for private user."); }
        res.json(req.params.appt);
    });
    
    // List details of user with specified id; takes parameter userID
    app.get('/api/User/:userID', auth, validateID, function (req, res) {
        if (req.payload._id !== req.params.user._id){ return res.status(401).send("Unauthorized: Cannot retrieve details for private user."); }
        res.json(req.params.user);
    });
    
    // List all appointments for provider with specified provider id; takes parameter providerID
    app.get('/api/AppointmentsForProvider/:providerID', auth, validateID, function(req, res) {
        if (req.payload._id !== req.params.providerID){ return res.status(401).send("Unauthorized: Cannot retrieve appointments for private user."); }
        Appointment.find({providerID: req.params.providerID})
        .populate('userID')
        .exec(function(err, data){
            if (err) { return res.status(500).send(dbErr + "Unable to get list of appointments : " + err); }
            res.json(data);
        });
    });
    
    // List all appointments for user with specified id; takes parameter userID
    app.get('/api/Appointments/:userID', auth, validateID, function(req, res) {
        if (req.payload._id !== req.params.userID){ return res.status(401).send("Unauthorized: Cannot retrieve appointments for private user."); }
        Appointment.find({userID: req.params.userID})
        .populate('providerID')
        .exec(function(err, data){
            if (err) { return res.status(500).send(dbErr + "Unable to get list of appointments : " + err); }
            res.json(data);
        });
    });
    
    // List all users who are service providers
    app.get('/api/Providers', auth, validateID, function(req, res) {
        User.find({serviceProvider: true})
        .exec(function(err, data){
            if (err) { return res.status(500).send(dbErr + "Unable to get list of users : " + err); }
            res.json(data);
        });
    });
    
    // Frontend AngularJS-based single page website
    app.get('*', function(req, res) {
        res.sendFile('index.html', { root:"public" });
    });
    
/* Error Handling Middleware */
    // Catch unauthorised errors
    app.use(function (err, req, res, next) {
        if (err.name === 'UnauthorizedError') {
            res.status(401).json({"message" : err.name + ": " + err.message});
        }
    });

/* Server */
    // Initialize web server
    var server = app.listen(ENVPORT, function() {
       var host = server.address().address;
       var port = server.address().port;
       
       console.log("Booking app listening at http://%s:%s", host, port);
    });