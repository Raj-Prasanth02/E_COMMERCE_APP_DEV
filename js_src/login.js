const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
const usersSchema = require('../MongoDB_Connection/registerSchema')
const passwordAttemptSchema = require('../MongoDB_Connection/passwordAttempt_Schema')
const bcrypt = require('bcrypt')
//const jwt = require("jsonwebtoken");
//const crypto = require("crypto");
const router = express.Router()

router.use(cors())
router.use(bodyParser.json())

//Fetching the data from the request body:
//var urlencodedParser = bodyParser.urlencoded({ extended: false }); //Get in json structure. Access req.body or we can use app.use(bodyParser.json()); to avoid using urlencodedparser in every API
router.post('/login', async function (req, res) {
  user = req.body.user
  password = req.body.password
  const userType = checkUsername_Or_Email_Or_Mobile(user)
  console.log('checking u_type', userType)
  const userID_Res = await tempUserId(user, userType)

  function checkUsername_Or_Email_Or_Mobile (user) {
    if (!isNaN(user) && !user.includes('.')) {
      //This will check the given input is whole number or not.
      return 'MobileNumber'
    } else if (user.match(mailformat)) {
      //This will check Email or not
      return 'Email'
    } else {
      return 'userName'
    }
  }

  async function tempUserId (tempUser_id, user_Type) {
    function tempUser () {
      const promise = new Promise(function (resolve, reject) {
        //Promise will return pending, success or failure status.
        const query = {}
        query[user_Type] = tempUser_id
        console.log('find user and pass-> ', query)
        usersSchema.find(query, function (err, data) {
          //In data will get the user detail.
          console.log('data ', data)
          console.log(data.length)
          if (data.length == 0) {
            resolve({ sts: false })
          } else if (data.length > 0) {
            resolve({ tempId: data[0]._id })
          } else {
            reject({ error: err })
          }
        })
      })

      return promise
    }

    var tempIDStatus = await tempUser()
    return tempIDStatus
  }

  console.log('Fetching Id ', userID_Res)
  if (userID_Res.tempId) {
    //If user is available in user schema.
    var invalidPasswordAttemptCount = await idCheckForInvalidLogin(
      userID_Res.tempId,
      'checkIncorrectAttemptCount'
    )
  }

  console.log('Attempt count--> ', invalidPasswordAttemptCount)
  if (
    !invalidPasswordAttemptCount ||
    invalidPasswordAttemptCount.inCorrectAttemptCount < 3
  ) {
    var loginCheckRes = await loginCheck(user, password, userType)
    console.log('userType-->', userType)
    console.log('Login status -->', loginCheckRes)
    if (loginCheckRes.status) {
      if (invalidPasswordAttemptCount.userId) {
        await idCheckForInvalidLogin(
          loginCheckRes.Id,
          'updateIncorrectAttemptCount',
          'delete'
        )
      }
      console.log('Logged in check')
      res.status(200).send({ message: 'Logged in..!' })
    } else if (!loginCheckRes.status && loginCheckRes.Id) {
      console.log('Username is correct but password is wrong')
      await idCheckForInvalidLogin(
        loginCheckRes.Id,
        'updateIncorrectAttemptCount',
        'add'
      )
      res.status(400).send({
        message: `You have only ${
          isNaN(invalidPasswordAttemptCount.inCorrectAttemptCount)
            ? 2
            : 2 - invalidPasswordAttemptCount.inCorrectAttemptCount
        } more attempts to sign in`
      }) //initially count is not available in DB hence using ternary operator returns3 directly to prevent NaN.
    } else {
      console.log('user not found')
      res.status(400).send({ message: 'No user found' })
    }
  } else {
    console.log('Tried more than 3 times')
    res
      .status(400)
      .send({ message: 'You entered invalid password for more than 3 times' })
  }

  res.end()
})

async function loginCheck (_user, _password, uTyp) {
  function loginCheckInDB () {
    //Instead of using arrow => , function
    const promise = new Promise(function (resolve, reject) {
      //Promise will return pending, success or failure status.
      const query = {}
      query[uTyp] = _user

      console.log('find user and pass->', query)
      usersSchema.find(query, function (err, data) {
        //In data will get the user detail.
        console.log(data.length)
        if (data.length === 0) {
          resolve(false)
        } else if (data.length > 0) {
          const passwordsMatch = bcrypt.compareSync(_password, data[0].password) //Comparing user entered password and DB password
          console.log('true/False of hasehedPassword->', passwordsMatch)
          if (passwordsMatch) {
            resolve({ status: true, Id: data[0]._id, Name: data[0].firstName })
          } else {
            resolve({ status: false, Id: data[0]._id, Name: data[0].firstName })
          }
        } else {
          reject(err)
        }
      })
    })

    return promise
  }

  var loginStatus = await loginCheckInDB()
  return loginStatus
}

async function idCheckForInvalidLogin (user, countOption, updateOption = '') {
  //check whether the count record is available in passwordAttempt schema

  function idCheckInDB () {
    const promise = new Promise(function (resolve, reject) {
      passwordAttemptSchema.find(
        {
          userId: user
        },
        function (err, data) {
          console.log('idCheckInDB ', data)
          if (data.length === 0) {
            resolve(false)
          } else if (data.length > 0) {
            resolve({
              status: true,
              inCorrectAttemptCount: data[0].count,
              userId: data[0].userId
            })
          } else {
            reject(err)
          }
        }
      )
    })

    return promise
  }

  function updateIncorrectAttemptCount (updateOption) {
    const promise = new Promise(async function (resolve, reject) {
      var status = await idCheckInDB()
      console.log('updateIncorrectAttemptCount ', status)
      if (status.userId) {
        if (updateOption === 'add') {
          //For update the count if he tries more than 1 time
          {
            passwordAttemptSchema.updateOne(
              { userId: status.userId },
              { $set: { count: status.inCorrectAttemptCount + 1 } },
              function (err, data) {
                console.log(
                  'checking type of sts ',
                  status.inCorrectAttemptCount + 1
                )
                if (err) {
                  console.log(err)
                  reject(err)
                } else {
                  console.log(
                    'Updated incorrect password attempt count : ',
                    data
                  )
                  resolve(data.count)
                }
              }
            )
          }
        } else if (updateOption === 'delete') {
          //Delete the user's count data if user enters correct password
          passwordAttemptSchema.deleteOne(
            { userId: status.userId },
            (err, result) => {
              if (err) {
                console.log(err)
                reject(err)
              } else {
                console.log(
                  'Deleted because you entered the correct password within 3 attempt'
                )
                resolve(result)
              }
            }
          )
        }
      } else {
        if (updateOption === 'add') {
          //Create count data
          var passAttemptSave = new passwordAttemptSchema({
            userId: user,
            count: 1 //USer enters wrong password for the 1st time.
          })

          passAttemptSave.save(function (err, user) {
            if (err) {
              console.log(err)
              reject(err)
            } else {
              console.log(
                user.userId,
                ' entered incorrect credential for ',
                user.count,
                'times' + ' successfully created.'
              )
              resolve(user.count)
            }
          })
        }
      }
    })
    return promise
  }

  if (countOption == 'checkIncorrectAttemptCount') {
    var idStatus = await idCheckInDB()
    return idStatus
  } else if (countOption == 'updateIncorrectAttemptCount') {
    var idStatus = await updateIncorrectAttemptCount(updateOption)
    return idStatus
  }
}

module.exports = router
