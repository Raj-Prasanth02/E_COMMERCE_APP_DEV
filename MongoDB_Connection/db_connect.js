const express = require('express'); //Need middleware to serve port to this file
const router = express.Router(); //It requires middleware function

var mongoose = require('mongoose');
// make a DB connection 
mongoose.connect('mongodb://localhost:27017/E_Commerce');

// get reference to database
var db = mongoose.connection;

//Connecting DB whether connecting successfully or throwing error
db.on('error', console.error.bind(console, 'connection error:'));


//Once successfully created
db.once('open', function() {
    console.log("Connection Successful!");
});

module.exports = router; //Export the router to use in main file