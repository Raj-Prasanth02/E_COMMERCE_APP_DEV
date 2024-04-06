//import logo from './logo.svg';
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import MyForm from './Components/sign_up.js'
import Login from './Components/login.js'
import ForgetPassword from './Components/forgetPassword.js'
import PasswordReset from './Components/passwordReset.js'


//import MyForm from './Components/sign_up';

export default function App () {

  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route path='' element={<Login />} />
          <Route path='/signup' element={<MyForm />} />
          <Route path='/forgetpassword' element={<ForgetPassword />} />
          <Route path='/passwordreset/:token' element={<PasswordReset />} />
        </Routes>
      </div>
    </Router>
  )
}
