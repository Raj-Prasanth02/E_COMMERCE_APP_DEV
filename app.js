const express = require('express');
const app = express();
const port = 4000;

const loginPage = require('./js_src/login');
const signUpPage = require('./js_src/signUp');
const passwordReset = require('./js_src/passwordReset');
const dbConnect = require('./MongoDB_Connection/db_connect');

app.use(express.json());

// app.use('/log',loginPage); //we have to add it in '/log/login' in postman
// app.use('/sign',signUpPage); //Need to hit in postman : localhost:4000/sign/signUp

app.use(loginPage); //we directly giving the API in post method. So '/' is enough
app.use(signUpPage); ////Need to hit in postman : localhost:4000/signUp 
app.use(dbConnect);
app.use(passwordReset);

// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
}); 
