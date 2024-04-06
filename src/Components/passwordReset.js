  import { useState, useEffect } from 'react';
  import { useParams } from "react-router-dom";
  //Create a virtual DOM, its load the particular change  

  export default function PasswordReset() {

      const [inputs, setInputs] = useState({});

      const [responseMessage, setresponseMessage] = useState();

      const [validUrl, setValidUrl] = useState(false); //To check whether URL is valid or not

    const param = useParams();
    const token = param.token;
    console.log('URL---------->',token);

    useEffect(() => { //For validating, we are using this GET method
      fetch(`http://localhost:4000/passwordresetValidate/${token}`) //This is like get method, we can pass the data to the server as q query in URL or we get the details using param
        .then(response => response.json())
        .then(data => {
        console.log(data);
        setValidUrl(data.valid);
        setresponseMessage(data.message);
      })
      .catch(error =>{ console.log(error)
        setresponseMessage(error.message);
      });
}, [token]);


    function eyeToggle() {
      var x = document.getElementById("confirmPassword");
      if (x.type === "password") {
        x.type = "text";
      } else {
        x.type = "password";
      }
    }

      const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}))
      }


      const handleConfirmPassword = (event) => {
        event.preventDefault();
        if (inputs.password === inputs.confirmPassword){
            setresponseMessage('Password matched');
        }
        else{
            setresponseMessage('Password Not matched');
        }
      }

      const HandleSubmit = (event) => {
        event.preventDefault(); //It will not make the screen refresh
        if (inputs.password === inputs.confirmPassword) {
        // passwords match, continue with form submission
        console.log("Passwords match");
      } else {
        // passwords don't match, show error message
        console.log("Passwords don't match");
      }

      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({"password":inputs.password,"confirmPassword":inputs.confirmPassword})
    };
        fetch(`http://localhost:4000/passwordreset/${token}`, requestOptions)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data);
            setresponseMessage(data.message);
            if(data.Error){
              throw new Error("Something went wrong. Please try again later :(");
              
            }
        })
        .catch((err)=>{
          console.log(err);
          setresponseMessage(err.message); //message is the default keyword to show the error text
      });
      console.log('Verify URL ',token);

  } //This empty array makes to prevent the call everytime once a single field is feeded by the user.


    
  if (!validUrl) {
    return <h2 id = 'responseText'> {responseMessage} </h2>
  }

  else{    
    return (
      <form onSubmit={HandleSubmit}>
      
        <label>Password:
        <input 
          id = 'password'
          type="password" 
          name="password"
          pattern="(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{:;'?/.,\|]).{8,}"
          title="Must contain at least one number and one uppercase and lowercase letter and special character, and at least 8 to 20 characters"
          value={inputs.password || ""} 
          onChange={handleChange}
          required
        />
        </label>
        <label>Confirm Password:
        <input 
          id = 'confirmPassword'
          type="password" 
          name="confirmPassword"
          pattern="(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{:;'?/.,\|]).{8,}"
          title="Password must be same as you given in above"
          value={inputs.confirmPassword || ""} 
          onChange={handleChange}
          onKeyUp = {handleConfirmPassword}
          required
        />
        </label>
        <br/>
        <input type="checkbox" onClick={eyeToggle}/> Show Password 
        <br/><br/>
          <input type="submit" value = 'submit' />
        <br/><br/>
        <br/>
        <h2 id = 'responseText'> {responseMessage} </h2>
      </form>
    )
  }
}
