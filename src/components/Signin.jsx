import React from 'react';

// import './Signin.css';
import {Link, useNavigate} from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import { useState } from 'react';

const Signin = () => {
const{signIn}=UserAuth();
const [email, setEmail]=useState('')
const [password, setPassword]=useState('')
const [error, setError]=useState('')
const navigate=useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  try {
    await signIn(email, password);
    navigate('/account')
  } catch (e) {
    setError(e.message);
    console.log(e.message);
  }
};



  return (
    <div className='Signin-container'>
    <div>
      <h1 className='signin-text1'>Sign in to your account</h1>
      <p className='signin-text2'>
          Don't have an account yet? <Link to='/signup' className='signin-text3'>Sign up.</Link>
      </p>
    </div>
    <form>
      <div className='email-container'>
          <label>Email Address</label>
          <input  onChange={(e) => setEmail(e.target.value)} type="email" className='email'/>
      </div>
      <div className='password-container'>
          <label>Password</label>
          <input  onChange={(e) => setPassword(e.target.value)} type="password" className='password'/>
      </div>
      <div className="wrapper-function-signin">
    <a className="wrapper-function-text-signin" onClick={handleSubmit} href="#" type="submit"><span>Sign In</span></a>
    </div>
    </form>
  </div>
  )
}

export default Signin
