const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const usersSchema = require('../MongoDB_Connection/schema');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const router = express.Router();


router.use(cors());
router.use(bodyParser.json());

//Fetching the data from the request body:
//var urlencodedParser = bodyParser.urlencoded({ extended: false }); //Get in json structure. Access req.body or we can use app.use(bodyParser.json()); to avoid using urlencodedparser in every API
router.post('/login',async function (req, res) {  
   user = req.body.user;
   password = req.body.password;
   const userType = checkUsername_Or_Email_Or_Mobile(user);
   var user = await loginCheck(user,password,userType);
   console.log('userType-->',userType);
   console.log('Login status -->',user);
   if (user.status){ 
    //create token for login
    const secretKey = crypto.randomBytes(32).toString('hex');
    const token = jwt.sign({ id: user._id }, secretKey);
    console.log("Generate Token -> ",token)
    res.status(200).send({"message":"Logged in..!","token":token});
   
}
    else{
    res.status(400).send({"message": `Invalid ${userType.charAt(0).toUpperCase()+userType.slice(1)} or Password...`}); //Here I am converting only the 1st character
}
   res.end();
});



function checkUsername_Or_Email_Or_Mobile (user){
    if(!isNaN(user)&&(!user.includes('.'))){ //This will check the given input is whole number or not.
        return 'MobileNumber' 
    }
    else if (user.match(mailformat)){ //This will check Email or not 
        return 'Email'
    }
    else{
        return 'userName'
    }
}

async function loginCheck(_user,_password,uTyp){

    function loginCheckInDB() { //Instead of using arrow => , function 
    const promise = new Promise(function (resolve, reject) { //Promise will return pending, success or failure status.
        const query = {}
        query[uTyp] = _user;
        
        console.log('find user and pass->',query) 
        usersSchema.find(query, function (err, data) {  //In data will get the user detail. 
            console.log(data.length);
            if (data.length === 0) {
                resolve(false);
            }
            else if (data.length > 0){
                const passwordsMatch = bcrypt.compareSync(_password, data[0].password);
                console.log('true/False of hasehedPassword->',passwordsMatch);
                if (passwordsMatch){
                    resolve({"status":true,"Id":data[0]._id,"Name":data[0].firstName});
                }
                else{
                    resolve({"status":false});
                }}
            else{
                reject(err);
            }
            });     
    });

    return promise;
    };

    var loginStatus = await loginCheckInDB();
    return loginStatus;
}


module.exports = router;