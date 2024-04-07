const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = express.Router();
const jwt = require("jsonwebtoken");
const usersSchema = require('../MongoDB_Connection/registerSchema');
require('dotenv').config(); //To use env variable
const tokenSchema = require('../MongoDB_Connection/tokenSchema');
const sendMail = require('./sendingMail');
const op_CRUD_DB = require('./DB_CRUD_Operation');
//const crypto = require("crypto");
const bcrypt = require('bcrypt');

const secretKey = process.env.SECRET_KEY;

router.use(cors());
router.use(bodyParser.json());

router.post('/forgetPassword',async function (req, res) {  
    user = req.body.Email;
    console.log("checking body-> ",req.body)
    //var checkEmail = await checking_Email_inDb(user);
    query = { "Email":user }
    var checkEmail = await op_CRUD_DB.readFunction(query,usersSchema); //Will get the data if the data is avialble in DB

    console.log('pass reset link-> ',checkEmail[0]._id)
    if(checkEmail){
      const currentTime = new Date().getTime(); // Get the current time in milliseconds
      console.log("Current Time ",currentTime);
      const previousToken = await tokenSchema.findOne({ userId: checkEmail[0]._id }); // Find the previous token for the user
      console.log('Token schema table ',previousToken);
      if (!previousToken){    
        //const secretKey = crypto.randomBytes(32).toString('hex'); //the secret key is used to sign the JWT to ensure its integrity and authenticity.
        const options = { expiresIn: 120000 }; //Expires in ___secs
        console.log("secret Key -> ",secretKey) //the crypto package is used to generate a random secret key.
        const userData = { //Payload as 1st param to jwt sign
          id: checkEmail[0]._id
        };
        const newToken = jwt.sign(userData, secretKey, options); //The jsonwebtoken package is used to create and verify the JWT
        console.log("Generate Token -> ",newToken); //With secret key, the payload details will encoded with secret key and generate token
        // create url for password reset
        const url = `http://localhost:3003/passwordreset/${newToken}/`;

//As of now not using to store the recods in JWT_Token table, Creating this collection for time save
        var newTokenSave = new tokenSchema({ //Token save in JWT_Token Collection
          userId:checkEmail[0]._id,
          url:url
        });   
        await newTokenSave.save(function (err, user) {
          if (err) return err;
          console.log(user + " token successfully saved.");
        });
        setTimeout(() => {
          console.log('Inside setTimeout:', new Date());
          newTokenSave.deleteOne({userId:checkEmail[0]._id}, (err, result) => {
            if (err) throw err;
          });
        }, 120000); // 45000 milliseconds = 45 seconds

      //Send rest link to Mail:
      sendMail(checkEmail[0].Email,url,checkEmail[0].firstName); //This will import the sendMail script and send the link to respective Email. 
         

  //     res.status(200).send({message:"password reset link was successfully sent to your Email","url":url});
 
  res.status(200).send({
    message: 'password reset link was successfully sent to your Email'
  })

    }
    else {
      res.status(400).send({message: "The password reset link has been sent to your Email already"}); // Return a 429 (Too Many Requests) status code with a message indicating how long the user needs to wait before requesting a new link // ,"url":""
    }
  }
    else{
      res.status(400).send({message:"Invalid Email, Enter the correct mail ID"});
    }   
    res.end(); //,"url":""
});
  
  // async function checking_Email_inDb (user){
  //   const eMail_Available = new Promise(function (resolve, reject) { //Promise will return pending, success or failure status.
  //     usersSchema.find({ "Email":user }, function (err, data) {  //In data will get the user detail. 
  //       console.log("data length----->",data.length,data);
  //       if (data.length === 0) {
  //           resolve(false);
  //       }
  //       else if (data.length > 0){
  //           resolve({"status":true,"Id":data[0]._id,"firstName":data[0].firstName,"Email":data[0].Email});
  //           } 
  //       else{
  //           reject(err);
  //       }
  //       });     
  // });
  
  // return eMail_Available;
  // }


  router.get('/passwordresetValidate/:token', async function(req, res) { //For validaing, we are using get method.
    const token = req.params.token;
  
    try {
      const decoded = jwt.verify(token, secretKey); // Verify the token using the secret key
      const user = await usersSchema.findOne({ _id: decoded.id }); // Find the user associated with the token
  
      if (!user) { //May not possible to go inside this
        res.status(404).json({ message: 'User not found' }); // Return an error if the user is not found
      } else {
        res.status(200).json({ valid: true }); // Return a success response if the user is found
      }
    }   
    
    catch (err) { //Line 147: Catch code will give an exact error
      if (err instanceof jwt.JsonWebTokenError) {
        console.log("Error message ",err.message);
        if (err.message === 'invalid token') { //Header token error
          res.status(401).send({valid: false,message:"Invalid URL, Click the correct URL which you got from Email"});
        } else if (err.message === 'invalid signature') { //Encoded secret key code error
          res.status(401).send({valid: false,message:"Invalid URL, Check once"});
        } else if (err.message === 'jwt expired'){ //Token expired
          res.status(401).send({valid: false,message:"The link has Expired, Try again"});
        }
      }
      else {//If encoded payload token is wrong
          console.log("Payload encoded error ",err);
          res.status(401).send({valid: false,message:"Invalid URL"});
      }
    }
    res.end();
  }
);


router.put('/passwordreset/:token',async function (req, res) {   //:token (dynamic value)
  try{  
  const _password = req.body.password; //Fetching from body
  const _confirmPassword = req.body.confirmPassword;
  const _token = req.params.token; //Fetching from url using params  
  console.log("checking body-> ",_password,_token);
  const decodedID = jwt.verify(_token, secretKey); //Main thing to handle error if token is invalid
    console.log('Find the decoded id -> ',decodedID); // Output: { id: 'user Id which is in db }

  query = { "_id":decodedID.id }
  var userCheck = await op_CRUD_DB.readFunction(query,usersSchema);
  //var userCheck = await check_for_validUser(decodedID.id);
  console.log('user availablity-> ',userCheck)
  if (_confirmPassword === _password ){
    if(userCheck.length > 0){
      const saltRounds = 10;
      const salt = bcrypt.genSaltSync(saltRounds);
      // hash the password using the salt value
      const UpdatedhashedPassword = bcrypt.hashSync(_password, salt);
      usersSchema.updateOne(
        { "_id": decodedID.id },
        { $set: { "password": UpdatedhashedPassword }},function (err, docs) {
          if (err){
              console.log(err)
          }
          else{
              console.log("Updated User : ", docs); 
            }
      });
      res.status(200).send({message:"Password saved successfully"});
      }
      else{
        res.status(200).send({message:"User no found"});
      }
  }      
  else{
    res.status(400).send({message:"Password and confirm password is not matching"});
    }
  }
  
  catch (err) { //Line 147: Catch code will give an exact error
    if (err instanceof jwt.JsonWebTokenError) {
      console.log("Error message ",err.message);
      if (err.message === 'invalid token') { //Header token error
        res.status(401).send({message:"Invalid URL, Click the correct URL which you got from Email"});
      } else if (err.message === 'invalid signature') { //Encoded secret key code error
        res.status(401).send({message:"Invalid URL, Check once"});
      } else if (err.message === 'jwt expired'){ //Token expired
        res.status(401).send({message:"The link has Expired, Try again"});
      }
    }
    else {//If encoded payload token is wrong
        console.log("Payload encoded error ",err);
        res.status(401).send({message:"Invalid URL"});
    }
  }

  res.end();
});


// async function check_for_validUser (userID){
//   const id_Available = new Promise(function (resolve, reject) { 
//     usersSchema.find({ "_id":userID }, function (err, data) {  
//       console.log(data.length);
//       if (data.length === 0) {
//           resolve(false);
//       }
//       else if (data.length > 0){
//           resolve(true);
//           } 
//       else{
//           reject(err);
//       }
//       });     
// });

// return id_Available;
// }

module.exports = router;



