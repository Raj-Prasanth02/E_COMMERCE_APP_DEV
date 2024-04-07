const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const usersSchema = require('../MongoDB_Connection/registerSchema');
const op_CRUD_DB = require('./DB_CRUD_Operation');
const bcrypt = require('bcrypt');
const router = express.Router();

router.use(cors());
router.use(bodyParser.json());

router.post('/signUp', async function (req, res){ //Post method. Sending the data from the client to server in body, not in url. So we are using POST method
    console.log('Request-->',req.body);


    let {firstName, lastName, userName, Email, password, MobileNumber, Address} = req.body;

    if (!firstName || !lastName || !userName || !Email || !password || !MobileNumber || !Address){
        return res.status(400).json({ msg: "Not all fields have been entered." });
    }
    
    //generate a salt value - To add the extra letters between password and find the hash code for it.
    else{
          const saltRounds = 10;
          const salt = bcrypt.genSaltSync(saltRounds);

          // hash the password using the salt value
          const hashedPassword = bcrypt.hashSync(password, salt);
          console.log("Hashed password ->",hashedPassword);
          
          var result = await signUpDataToMongoDB(firstName,lastName,userName,Email,hashedPassword,MobileNumber,Address); 
          //True will return if the record stores successfully.
          console.log('Checking final res',result);
          if (result.status){ 
              res.status(200).send({message:"Successfully Registered..!"});
          }
          else{
              res.status(400).send({Error: `The ${result.userType} is already registered..!` });
          }
        }
        res.end();
      });    


router.post('/userName_availability_Check',async function (req, res){
  console.log('Request-->',req.body);
  let userName = req.body.userName;
  var checkUserNameQuery = {"userName":userName}
  var checkUserName = await op_CRUD_DB.readFunction(checkUserNameQuery,usersSchema);
  console.log('checking userName in DB -> ',checkUserName)
  if(checkUserName.length == 0){
    res.status(200).send();
  }
  else if (checkUserName.length > 0){
    res.status(400).send();
  }
  else{
    res.send(401).send();
  }
  
})

async function signUpDataToMongoDB(fName, lName, uName, mail, pass, mobile, addr) {
      
    var query = {
      $or: [ //This is mongoDB query to check either email or nobile number is in table.
        {'userName':uName },
        { 'Email': mail },
        { 'MobileNumber':mobile }
      ]
    }
    const duplicateUserCheck = await op_CRUD_DB.readFunction(query, usersSchema)  
    console.log('username------ ',duplicateUserCheck);
    if (duplicateUserCheck.length === 0) {
      var newSignUp = new usersSchema({
        firstName: fName,
        lastName: lName,
        userName: uName,
        Email: mail,
        password: pass,
        MobileNumber: mobile,
        Address: addr
      });
  
      newSignUp.save(function (err, user) {
        if (err) return err;
        console.log(user.Email + " successfully created.");
      });
      return {"status":true,"userType":""};
    }
    else if (duplicateUserCheck.length > 0){
      console.log('Checking Email-->',duplicateUserCheck.map(obj => obj.Email)[0]);
      console.log('Checking Email __1-->',duplicateUserCheck[0].Email);

        if (uName==duplicateUserCheck.map(obj => obj.userName)[0]){
            return {"status":false,"userType":"Username"};                    
        }
        else if (mail==duplicateUserCheck.map(obj => obj.Email)[0]){
          return {"status":false,"userType":"Email ID"};
          
        }
        else{
          return ({"status":false,"userType":"Mobile Number"});
        }
    }
    else{
        return duplicateUserCheck; // If there any error returns
    }

  };

  module.exports = router;