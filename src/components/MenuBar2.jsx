import React, { useState, useRef, useEffect } from "react";
import "./MenuBar2.css";
import { Link, useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import WidgetsRoundedIcon from "@mui/icons-material/WidgetsRounded";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CloseIcon from "@mui/icons-material/Close";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import StyleRoundedIcon from "@mui/icons-material/StyleRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import Login from "./login.jsx";
import Box from "@mui/material/Box";

const theme = createTheme({
  palette: {
    primary: {
      main: "#004d40",
    },
    secondary: {
      main: "#004d40",
    },
  },
});

const logoImages = [
  "/static/images/LO1.png",

  // Add more logo image paths here if needed
];

export default function MenuBar2() {
  const [isOptionsVisible, setOptionsVisible] = useState(false);
  const [isSigninVisible, setSigninVisible] = useState(false);
  const optionsRef = useRef(null);
  const profileButtonRef = useRef(null);
  const [isRegVisible, setRegVisible] = useState(false);

  // const hideElements_Signin = () => {
  //   document
  //     .querySelector(".additional-block-close-Reg-menu")
  //     .classList.add("hide");
  //   document.querySelector(".overlay-Reg").classList.add("hide");
  //   document.querySelector(".Reg-menu").classList.add("hide");
  //   document.querySelector(".additional-blocks-Reg").classList.add("hide");
  //   document.querySelector(".additional-block-text-Reg").classList.add("hide");
  // };

  // const hideElements_Reg = () => {
  //   document
  //     .querySelector(".additional-block-close-Reg-menu")
  //     .classList.add("hide");
  //   document.querySelector(".overlay-Reg").classList.add("hide");
  //   document.querySelector(".Reg-menu").classList.add("hide");
  //   document.querySelector(".additional-blocks-Reg").classList.add("hide");
  //   document.querySelector(".additional-block-text-Reg").classList.add("hide");
  // };

  // const exitReg = () => {
  //   // 其他逻辑
  //   hideElements_Reg();
  // };

  // const exitSignin = () => {
  //   // 其他逻辑
  //   hideElements_Signin();
  // };

  const toggleOptions = () => {
    setOptionsVisible(!isOptionsVisible);
  };

  const toggleReg = () => {
    navigate("/login");
  };

  const toggleSignin = () => {
    navigate("/loginCheck");
  };

  const toggleRes = () => {
    navigate("/realrespage");
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

  const navigate = useNavigate();
  const [logoIndex, setLogoIndex] = useState(0);

  const handleButtonClick = () => {
    navigate("/realmappage");
  };

  const handleButtonClick2 = () => {
    navigate("/");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLogoIndex((prevIndex) => (prevIndex + 1) % logoImages.length);
    }, 10000); // Change logo every 3 seconds (adjust this interval as needed)

    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <div className="menubar2">
        <div className="logo-wrapper">
          <img
            src={logoImages[logoIndex]}
            className="Logo-amble"
            alt="Logo"
            onClick={handleButtonClick2}
          />
        </div>
        <div className="menu-items">
          <div className="menu-item" onClick={handleButtonClick}>
            Create an amble
          </div>
          <div className="menu-item" onClick={toggleRes}>For you</div>
          <div
            className="menu-item"
            onClick={toggleOptions}
            ref={profileButtonRef}
          >
            Login/Register
          </div>
          {isOptionsVisible && (
            <div className="options-box-menubar2" ref={optionsRef}>
              <button className="option-menubar2" onClick={toggleReg}>
                {" "}
                <span className="option-text-menubar2" >
                  Sign Up
                </span>
              </button>
              <button className="option-menubar2" onClick={toggleSignin}>
                <span className="option-text-menubar2" >
                  Sign In</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </ThemeProvider>
  );
}
