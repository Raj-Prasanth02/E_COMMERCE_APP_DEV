import loginCSS from './login.module.css'
import { useState } from 'react'

//Create a virtual DOM, its load the particular change

export default function Login () {
  const [inputs, setInputs] = useState({})

  const [responseMessage, setresponseMessage] = useState('Welcome to Happycart')

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

  const HandleSubmit = event => {
    event.preventDefault() //It will not make the screen refresh
    //alert(inputs);

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: inputs.user, password: inputs.password }) //JSON.stringify(inputs)
    }
    fetch('http://localhost:4000/login', requestOptions)
      .then(response => {
        return response.json()
      })
      .then(data => {
        console.log(data)
        setresponseMessage(data.message)
        if (data.Error) {
          throw new Error('Something went wrong. Please try again later :(')
        }
      })
      .catch(err => {
        console.log(err)
        setresponseMessage(err.message) //message is the default keyword to show the error text
      })
  } //This empty array makes to prevent the call everytime once a single field is feeded by the user.

  return (
    
    <div class={loginCSS.container}>
      <div class={loginCSS.sign_in}>
        <h1>Sign In</h1>
        <form onSubmit={HandleSubmit}>
          <div class={loginCSS.form_group}>
            <label for='e-mail'>username</label>
            <input
              id='e-mail'
              type='text'
              name='user'
              placeholder='Username or Email or Mobile Number'
              value={inputs.user || ''} //If value or null
              onChange={handleChange}
              required
            />
          </div>
          <div class={loginCSS.form_group}>
          <label for='password'>Password</label>
            <input
              id='password'
              type='password'
              name='password'
              placeholder = 'Password'
              value={inputs.password || ''}
              onChange={handleChange}
              required
            />
          </div>
          <div class={loginCSS.checkbox_forget}>
            <div class={loginCSS.show_password}>
              <input type='checkbox' id='checkbox' onClick={eyeToggle} />{' '}
              <label for='checkbox'> Show Password </label>
            </div>
            <p>
              {' '}
              <a href='/forgetpassword'> Forget Password </a>
            </p>
          </div>
          <div class={loginCSS.submit}>
            <button type='submit'>Sign In</button>
          </div>
        </form>
      </div>

      <div class={loginCSS.sign_up}>
        <h2 id={loginCSS.responseText}> {responseMessage} </h2>
        <div class={loginCSS.create_account}>
          <p> Don't have an account ? </p>
          <div class={loginCSS.sign_up_btn}>
            <a href='/signup'>
              <button type='submit'>Sign Up</button>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
