const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var tokenSchema = Schema({
    userId: {type: Schema.Types.ObjectId,required: true,ref: "user",unique: true},
    url: {type: String, required: true},
    createdAt: { type: Date, default: Date.now, expires: 50 } //This will delete in the mongoDB within __ seconds, even my server stops
  });


var tokenModel = mongoose.models.tokenSchema || mongoose.model("JWT_Token", tokenSchema, "JWT_Token");     //Only creates very first time,if trying to add 2nd record. checking if the model exists then use it, else create it. 
module.exports = tokenModel;

