import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function PasswordReset() {
  const [inputs, setInputs] = useState({});
  const [responseMessage, setResponseMessage] = useState('');
  const [validUrl, setValidUrl] = useState(false);

  const { token } = useParams();
  console.log('URL----------------->', token);

  useEffect(() => {
    fetch(`http://localhost:4000/validatepasswordreset/${token}`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.isValid) {
          setValidUrl(true);
        }
      })
      .catch(error => console.log(error));
  }, [token]);

  function eyeToggle() {
    var x = document.getElementById('confirmPassword');
    if (x.type === 'password') {
      x.type = 'text';
    } else {
      x.type = 'password';
    }
  }

  const handleChange = event => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({ ...values, [name]: value }));
  };

  const handleConfirmPassword = event => {
    event.preventDefault();
    if (inputs.password === inputs.confirmPassword) {
      setResponseMessage('Password matched');
    } else {
      setResponseMessage('Password not matched');
    }
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (inputs.password === inputs.confirmPassword) {
      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: inputs.password,
          confirmPassword: inputs.confirmPassword
        })
      };
      fetch(`http://localhost:4000/passwordreset/${token}`, requestOptions)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          setResponseMessage(data.message);
          if (data.Error) {
            throw new Error('Something went wrong. Please try again later :(');
          }
        })
        .catch(err => {
          console.log(err);
          setResponseMessage(err.message);
        });
    } else {
      setResponseMessage('Passwords do not match');
    }
  };

  if (!validUrl) {
    return <h2>Invalid URL</h2>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Password:
        <input
          id="password"
          type="password"
          name="password"
          pattern="(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{:;'?/.,|]).{8,}"
          title="Must contain at least one number and one uppercase and lowercase letter and special character, and at least 8 to 20 characters"
          value={inputs.password || ''}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Confirm Password:
        <input
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          pattern="(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{:;'?/.,|]).{8,}"
          title="Password must be same as you given in above"
          value={inputs.confirmPassword || ''}
          onChange={handleChange}
          onKeyUp={handleConfirmPassword}
          required
        />
      </label>
      <br />
      <input type="checkbox" onClick={eyeToggle} /> Show Password
      <br/><br/>
          <input type="submit" value = 'submit' />
        <br/><br/>
        <br/>
        <h2 id = 'responseText'> {responseMessage} </h2>
      </form>
    )
  }