import { useState, useEffect } from 'react'
import forgetCSS from './forget.module.css'

//import { Link } from "react-router-dom";
//Create a virtual DOM, its load the particular change

export default function ForgetPassword () {
  const [inputs, setInputs] = useState({})

  const [responseMessage, setresponseMessage] = useState()

  const [countdown, setCountdown] = useState(120)

  const [buttonDisabled, setButtonDisabled] = useState(false)

  const handleChange = event => {
    const name = event.target.name
    const value = event.target.value
    setInputs(values => ({ ...values, [name]: value }))
  }

  const HandleSubmit = event => {
    event.preventDefault() //It will not make the screen refresh
    //alert(inputs);

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Email: inputs.user }) //JSON.stringify(inputs)
    }
    fetch('http://localhost:4000/forgetPassword', requestOptions)
      .then(response => {
        return response.json()
      })
      .then(data => {
        console.log(data)
        if (
          data.message ===
          'password reset link was successfully sent to your Email'
        ) {
          setButtonDisabled(true)
          setCountdown(120)
        }
        setresponseMessage(data.message) //;+' ' + data.url

        if (data.Error) {
          throw new Error('Something went wrong. Please try again later :(')
        }
      })
      .catch(err => {
        console.log(err)
        setresponseMessage(err.message) //message is the default keyword to show the error text
      })
  } //This empty array makes to prevent the call everytime once a single field is feeded by the user.

  useEffect(() => {
    if (countdown > 0) {
      setTimeout(() => setCountdown(countdown - 1), 1000)
    } else {
      setButtonDisabled(false)
    }
  }, [countdown])

  return (
    <form className={forgetCSS.form} onSubmit={HandleSubmit}>
      <p className={forgetCSS.message}>Please enter the registered Email ID</p>
      <input
        className={forgetCSS.inputField}
        type='email'
        name='user'
        placeholder='Email ID'
        value={inputs.user || ''} //If value or null
        onChange={handleChange}
        required
      />

      <button
        type='submit'
        value='Login'
        disabled={buttonDisabled}
        className={forgetCSS.button}
      >
        {' '}
        SUBMIT{' '}
      </button>
    
      <h4 id={forgetCSS.responseText}>{responseMessage}</h4>

      {buttonDisabled && (
        <p className = {forgetCSS.responseMessage}>
          {`Please wait for ${countdown} seconds before sending the password reset link to Email again`}
        </p>
      )}
    </form>
  )
}
