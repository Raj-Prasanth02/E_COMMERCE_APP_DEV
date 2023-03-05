import { useState } from 'react';
//import ReactDOM from 'react-dom/client'; //Create a virtual DOM, its load the particular change

export default function MyForm() {
  const [inputs, setInputs] = useState({}); //inputs -. Form in JSON Format

  const [responseMessage, setresponseMessage] = useState();

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({...values, [name]: value}))
  }

  const HandleSubmit = (event) => {
    event.preventDefault(); //It will not make the screen refresh
    //alert(inputs);

        // POST request using fetch inside useEffect React hook
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({"firstName":inputs.firstName, "lastName":inputs.lastName, "Email":inputs.Email, "password":inputs.password, "MobileNumber":inputs.MobileNumber, "Address":inputs.Address})  //JSON.stringify(inputs)
            //body: "This is Raj!!"
        };
        fetch('http://localhost:4000/signUp', requestOptions)
        .then((response)=>{
            if(response.status===200){
               console.log('succesful Registered..!');
               setresponseMessage('succesful Registered..!');
      }        
            else{
            setresponseMessage('Already Registered. go to login page and sign in. :(');
            throw new Error("Already Registered. go to login page and sign in. :(");
            }
        })
        .catch((err)=>{
            console.log(err);
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
        <label>Email:
      <input 
        type="email" 
        name="Email" 
        value={inputs.Email || ""} 
        onChange={handleChange}
        required
      />
      </label>
      <label>Password:
      <input 
        type="password" 
        name="password"
        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}"
        title="Must contain at least one  number and one uppercase and lowercase letter, and at least 8 to 20 characters"
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
      <br/>
        <input type="submit" value = 'Sign Up' />
        <br/>
        <h2 id = 'responseText'> {responseMessage} </h2>
    </form>
  )
}

//const root = ReactDOM.createRoot(document.getElementById('root'));
//root.render(<MyForm />);