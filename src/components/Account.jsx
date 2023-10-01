import React from 'react'
import './Account.css'
import { UserAuth } from '../context/AuthContext'
import { async } from '@firebase/util'
import {Link, useNavigate} from 'react-router-dom';

const Account = () => {
  const navigate = useNavigate();
  const { user, logout } = UserAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/signin");
      console.log("You are logged out");
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <div className="account">
      <h1 className="account-text1">Account</h1>
      <p className="account-text2">User Email:{user && user.email}</p>
      <div className="wrapper-function-logout">
        <a
          className="wrapper-function-text-logout"
          href="#"
          type="submit"
          onClick={handleLogout}
        >
          <span>Log Out</span>
        </a>
      </div>
    </div>
  );
};

export default Account
