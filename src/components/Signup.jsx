import React from 'react';
import {Link, useNavigate} from 'react-router-dom';

// import './Signup.css';
import { async } from '@firebase/util';
import { UserAuth } from '../context/AuthContext';
import { useState } from 'react';


const Signup = () => {
    const [email, setEmail]=useState('')
    const [password, setPassword]=useState('')
    const [error, setError]=useState('')

    const [name, setName] = useState(''); // 新增name字段用于昵称
    const [address, setAddress] = useState(''); // 新增address字段用于住址

    const {createUser}=UserAuth();
    const navigate=useNavigate();

    const handleSubmit=async(e) =>{
        e.preventDefault()
        setError('')
        try{
            await createUser(email,password,name,address)
            // await createUser(email,password)
            navigate('/account')
        }catch(e){
            setError(e.message)
            console.log(e.message)
        }
    }

  return (
    <div className="Signup-container">
      <div>
        <h1 className="signup-text1">Sign up for a free account</h1>
        <p className="signup-text2">
          Already have an account yet?{" "}
          <Link to="/signin" className="signup-text3">
            Sign in.
          </Link>
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="email-container">
          <label>Email Address</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="email"
          />
        </div>

        <div className="name-container">
          <label>User Name</label>
          <input
            onChange={(e) => setName(e.target.value)}
            type="text"
            className="name"
          />
        </div>

        <div className="address-container">
          <label>Address</label>
          <input
            onChange={(e) => setAddress(e.target.value)}
            type="text"
            className="address"
          />
        </div>

        <div className="password-container">
          <label>Password</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="password"
          />
        </div>
        {/* <MyFunctionButton_signup onClick={handleSubmit} /> */}
        {/* <button className='button'>Sign Up</button> */}
        
          <div className="wrapper-function-signup">
    <a className="wrapper-function-text-signup" href="#" type="submit" onClick={handleSubmit}><span>Sign Up</span></a>
    </div>
      
      </form>
    </div>
  );
}

export default Signup
