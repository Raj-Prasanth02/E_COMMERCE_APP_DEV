const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var passwordAttemptSchema = Schema({
    userId: {type: Schema.Types.ObjectId,required: true,ref: "user",unique: true},
    count: {type: Number,required: true},
    createdAt: { type: Date, default: Date.now, expires: 3600 } //1hr = ___ secs
})



var passwordAttemptModel = mongoose.models.passwordAttemptSchema || mongoose.model("password_attempt", passwordAttemptSchema, "password_attempt");    //Only creates very first time,if trying to add 2nd record. checking if the model exists then use it, else create it. 
module.exports = passwordAttemptModel;