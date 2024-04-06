import signupCSS from './signup.module.css'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import user_1 from './Icons/person-outline.svg'
import user_2 from './Icons/person-add-outline.svg'
import user_3 from './Icons/person-circle-outline.svg'
import mail from './Icons/mail-outline.svg'
import password from './Icons/lock-closed-outline.svg'
import call from './Icons/call-outline.svg'
import location from './Icons/location-outline.svg'


//import ReactDOM from 'react-dom/client'; //Create a virtual DOM, its load the particular change
export default function MyForm () {
  const [inputs, setInputs] = useState({}) //inputs -. Form in JSON Format

  const [responseMessage, setresponseMessage] = useState() //Response for sign up

  const [responseUserNameMessage, setresponseUserNameMessage] = useState('') //Response for username availability check

  const handleChange = event => {
    const name = event.target.name
    const value = event.target.value
    setInputs(values => ({ ...values, [name]: value }))
  }

  function eyeToggle () {
    var x = document.getElementById('password')
    if (x.type === 'password') {
      x.type = 'text'
    } else {
      x.type = 'password'
    }
  }

  const handleUSerName = event => {
    event.preventDefault() //It will not make the screen refresh
    //alert(inputs);

    // POST request using fetch inside useEffect React hook
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName: event.target.value }) //JSON.stringify(inputs)
      //body: "This is Raj!!"
    }
    fetch('http://localhost:4000/userName_availability_Check', requestOptions)
      .then(response => {
        console.log('Find the resposne ', response)
        setresponseUserNameMessage('')
        if (response.status === 400) {
          throw new Error('UserName already used, try different UserName')
        } else if (response.status === 401) {
          throw new Error(
            'Something went wrong while checking username availablity'
          )
        }
      })
      .catch(err => {
        console.log(err)
        setresponseUserNameMessage(err.message) //message is the default keyword to show the error text
      })
  }

  const HandleSubmit = event => {
    event.preventDefault() //It will not make the screen refresh
    //alert(inputs);

    // POST request using fetch inside useEffect React hook
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: inputs.firstName,
        lastName: inputs.lastName,
        userName: inputs.userName,
        Email: inputs.Email,
        password: inputs.password,
        MobileNumber: inputs.MobileNumber,
        Address: inputs.Address
      }) //JSON.stringify(inputs)
      //body: "This is Raj!!"
    }
    fetch('http://localhost:4000/signUp', requestOptions)
      .then(response => {
        return response.json()
      })
      .then(data => {
        console.log(data)
        setresponseMessage(data.message)
        if (data.Error) {
          throw new Error(data.Error)
        }
      })
      .catch(err => {
        console.log(err)
        setresponseMessage(err.message) //message is the default keyword to show the error text
      })

    // empty  dependency array means this effect will only run once (like componentDidMount in classes)
  } //This empty array makes to prevent the call everytime once a single field is feeded by the user.

  return (
    <div class={signupCSS.container}>
      <div class={signupCSS.signup}>
        <h1>Sign Up</h1>
      </div>
      <form onSubmit={HandleSubmit}>
        <div></div>
        <div class={signupCSS.form_group}>
          <img src={user_1} alt='Icon' class={signupCSS.icon} />
          <input
            type='text'
            name='firstName'
            pattern='[A-Za-z]{3,20}'
            value={inputs.firstName || ''} //If value or null
            onChange={handleChange}
            placeholder='First Name'
            required
          />
        </div>
        <div class={signupCSS.form_group}>
          <img src={user_2} alt='Icon' className={signupCSS.icon} />
          <input
            type='text'
            name='lastName'
            pattern='[A-Za-z]{3,20}'
            value={inputs.lastName || ''} //If value or null
            onChange={handleChange}
            placeholder='Last Name'
            required
          />
        </div>

        <div class={signupCSS.form_group}>
          <img src={mail} alt='Icon' className={signupCSS.icon} />
          <input
            type='email'
            name='Email'
            pattern='[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$'
            title='Please provide the valid Email Address'
            value={inputs.Email || ''}
            placeholder='Email'
            onChange={handleChange}
            required
          />
        </div>

        <div class={signupCSS.form_group}>
          <img src={user_3} alt='Icon' className={signupCSS.icon} />
          <input
            type='text'
            name='userName'
            pattern='^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*_)[^\W]{8,}$'
            title="Username must contain atleast one upper case, one nu mber and special character '_' alone"
            value={inputs.userName || ''}
            placeholder='User Name'
            onChange={handleChange}
            onKeyUp={handleUSerName}
            required
          />
        </div>

        <div class={signupCSS.username_msg}>
          <p id={signupCSS.userNameMessage}> {responseUserNameMessage} </p>
        </div>

        <div class={signupCSS.form_group}>
          <img src={password} alt='Icon' className={signupCSS.icon} />
          <input
            id='password'
            type='password'
            name='password'
            pattern="(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{:;'?/.,\|]).{8,}"
            title='Must contain at least one number and one uppercase and lowercase letter and special character, and at least 8 to 20 characters'
            value={inputs.password || ''}
            placeholder='Password'
            onChange={handleChange}
            required
          />
        </div>

        <div class={signupCSS.show_password}>
          <input type='checkbox' id='checkbox' onClick={eyeToggle} />
          <label for='checkbox'> Show Password </label>
        </div>

        <div class={signupCSS.form_group}>
          <img src={call} alt='Icon' className={signupCSS.icon} />
          <input
            type='tel'
            name='MobileNumber'
            pattern='[0-9]{10}'
            title='Enter valid mobile number'
            value={inputs.MobileNumber || ''}
            placeholder='Mobile Number'
            onChange={handleChange}
            required
          />
        </div>
        <script
          type='module'
          src='https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js'
        ></script>
        <script
          nomodule
          src='https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js'
        ></script>
        <div>
          <ion-icon name='bandage-outline'></ion-icon>
        </div>
        <div class={signupCSS.form_group}>
          <img src={location} alt='Icon' className={signupCSS.icon} />
          <input
            type='text'
            name='Address'
            value={inputs.Address || ''}
            placeholder='Address'
            onChange={handleChange}
            required
          />
        </div>

        <div class={signupCSS.submit}>
          <button type='submit'>Sign Up</button>
        </div>
      </form>
      <h2 id={signupCSS.responseText}> {responseMessage} </h2>
      <p>
        Already have an account? <Link to='/'>Login</Link>
      </p>
    </div>
  )
}

//const root = ReactDOM.createRoot(document.getElementById('root'));
//root.render(<MyForm />);
