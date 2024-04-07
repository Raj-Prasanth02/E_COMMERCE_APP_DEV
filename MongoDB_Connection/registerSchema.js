//This file is used to create a schema in MongoDB, And using in login and signUp script whether the table with the records are available which the request body is getting from the user.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var usersSchema = Schema({
    firstName: {type:String,required: true},
    lastName: {type:String,required: true},
    userName: {type:String,required: true, unique: true},
    Email: {type:String,required: true, unique: true},
    password: {type:String,required: true},
    MobileNumber: {type:Number,required: true, unique: true},
    Address: String,
  },
   {
      collection: 'users'
    }
)

var userModel = mongoose.models.usersSchema || mongoose.model("users", usersSchema, "users");     //Only creates very first time,if trying to add 2nd record. checking if the model exists then use it, else create it. 
module.exports = userModel;