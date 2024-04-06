import { useState } from 'react';
import { Link } from "react-router-dom";
//import ReactDOM from 'react-dom/client'; //Create a virtual DOM, its load the particular change
export default function MyForm() {
  const [inputs, setInputs] = useState({}); //inputs -. Form in JSON Format

  const [responseMessage, setresponseMessage] = useState(); //Response for sign up

  const [responseUserNameMessage, setresponseUserNameMessage] = useState(); //Response for username availability check

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({...values, [name]: value}))
  }

  const handleUSerName = (event) => {
    handleChange(event)
    event.preventDefault(); //It will not make the screen refresh
    //alert(inputs);

        // POST request using fetch inside useEffect React hook
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "userName":inputs.userName })  //JSON.stringify(inputs)
            //body: "This is Raj!!"
        };
        fetch('http://localhost:4000/userName_availability_Check', requestOptions)
        .then((response) => {
          setresponseUserNameMessage("UserName Available");
    })
    .catch((err)=>{
      console.log(err);
      setresponseUserNameMessage("UserName already used, try different UserName"); //message is the default keyword to show the error text
  });


  }

  const HandleSubmit = (event) => {
    event.preventDefault(); //It will not make the screen refresh
    //alert(inputs);

        // POST request using fetch inside useEffect React hook
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({"firstName":inputs.firstName, "lastName":inputs.lastName, "userName":inputs.userName, "Email":inputs.Email, "password":inputs.password, "MobileNumber":inputs.MobileNumber, "Address":inputs.Address})  //JSON.stringify(inputs)
            //body: "This is Raj!!"
        };
        fetch('http://localhost:4000/signUp', requestOptions)
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

    // empty  dependency array means this effect will only run once (like componentDidMount in classes)
    } //This empty array makes to prevent the call everytime once a single field is feeded by the user.

  

  return (
    <form onSubmit={HandleSubmit}>
      <label>First Name:    
      <input 
        type="text" 
        name="firstName" 
        pattern="[A-Za-z]{3,20}"
        value={inputs.firstName || ""} //If value or null
        onChange={handleChange}
        required
      />
      </label>
      <label>Last Name:
        <input 
          type="text" 
          name="lastName"
          pattern="[A-Za-z]{1,20}"
          value={inputs.lastName || ""} 
          onChange={handleChange}
          required
        />
        </label>
        <label>User Name:
        <input 
          type="text" 
          name="userName"
          pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*_)[^\W]{8,}$"
          title="Username must contain atleast one upper case, one number and special character '_' alone"
          value={inputs.userName || ""} 
          onChange={handleUSerName}
          required
        />
        </label>
        <label>Email:
      <input 
        type="email" 
        name="Email" 
        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
        title="Please provide the valid Email Address"
        value={inputs.Email || ""} 
        onChange={handleChange}
        required
      />
      </label>
      <label>Password:
      <input 
        type="password" 
        name="password"
        pattern="(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{:;'?/.,\|]).{8,}"
        title="Must contain at least one number and one uppercase and lowercase letter and special character, and at least 8 to 20 characters"
        value={inputs.password || ""} 
        onChange={handleChange}
        required
      />
      </label>
      <label>Mobile No:
      <input 
        type="tel" 
        name="MobileNumber"
        pattern="[0-9]{10}"
        title="Enter valid mobile number"
        value={inputs.MobileNumber || ""} 
        onChange={handleChange}
        required
      />
      </label>
      <label>Address:
      <input 
        type="text" 
        name="Address"
        value={inputs.Address || ""} 
        onChange={handleChange}
        required
      />
      </label>
      <br/><br/>
        <input type="submit" value = 'Sign Up' />
        <br/>
        <p>Already registered? <Link to="/">Login</Link></p>
        <h2 id = 'responseText'> {responseMessage} </h2>
        <br/>
        <p id = 'userNameMessage'> {responseUserNameMessage} </p>
    </form>
  )
}

//const root = ReactDOM.createRoot(document.getElementById('root'));
//root.render(<MyForm />);



