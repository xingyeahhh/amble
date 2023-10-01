import React, { useState, useRef, useEffect } from "react";
import "./MenuBar.css";
import { Link, useNavigate } from "react-router-dom";
import WidgetsRoundedIcon from "@mui/icons-material/WidgetsRounded";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CloseIcon from "@mui/icons-material/Close";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import StyleRoundedIcon from "@mui/icons-material/StyleRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import Login from './login.jsx';
import Box from "@mui/material/Box";

export default function MenuBar() {
  const [isOptionsVisible, setOptionsVisible] = useState(false);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const optionsRef = useRef(null);
  const profileButtonRef = useRef(null);
  const menuButtonRef = useRef(null);
 



  const toggleOptions = () => {
    setOptionsVisible(!isOptionsVisible);
  };

  const navigate = useNavigate();
  const toggleMenu = () => {
   
      setMenuVisible(!isMenuVisible);
    
  };


  const toggleReg = () => {
    navigate("/login");
  };

  const toggleSignin = () => {
    navigate("/loginCheck");
  };

  const togglehome = () => {
    navigate("/");
  };

  const toggleamble = () => {
    navigate("/realmappage");
  };

  const toggleforyou= () => {
    navigate("/resources");
  };
  
  const handleClickOutside = (event) => {
    if (
      optionsRef.current &&
      !optionsRef.current.contains(event.target) &&
      !profileButtonRef.current.contains(event.target)
    ) {
      setOptionsVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);



  const handleClickOutsideM = (event) => {
    if (
      optionsRef.current &&
      !optionsRef.current.contains(event.target) &&
      !menuButtonRef.current.contains(event.target)
    ) {
      setMenuVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideM);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideM);
    };
  }, []);


  return (
    <div className="menubar-container">
      <div className="menu-button-wrapper">
        <WidgetsRoundedIcon
          className="menu-button"
          sx={{ fontSize: 24, color: "white" }}
          onClick={toggleMenu}
          ref={menuButtonRef}
        />
           {isMenuVisible && (
          <div className='options-homebox ${isMenuVisible ? "active" : ""}' ref={optionsRef}>
            <button className="option">
              {" "}
              <span className="option-text" onClick={togglehome}>
                Home
              </span>
            </button>
            <button className="option">
              <span className="option-text" onClick={toggleamble}>Create an amble</span>
            </button>
            {/* <button className="option">
              <span className="option-text"  >For you</span>
            </button> */}
          </div>
        )}
      </div>
      <div className="profile-button-wrapper">
        <PersonRoundedIcon
          className={`profile-button ${isOptionsVisible ? "active" : ""}`}
          sx={{ fontSize: 25, color: "white" }}
          onClick={toggleOptions}
          ref={profileButtonRef}
        />
        {isOptionsVisible && (
          <div className="options-box" ref={optionsRef}>
            <button className="option" onClick={toggleReg}>
              {" "}
              <span className="option-text" >
                Sign Up
              </span>
            </button>
            <button className="option"  onClick={toggleSignin}>
              <span className="option-text">Sign In</span>
            </button>
          </div>
        )}
      </div>
      
    </div>
  );
}
