import React, { useState, useEffect, createContext } from "react";
import axios from "axios";
import "./loginCheck.css";
import { Link, useNavigate  } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import { Alert, AlertTitle } from "@mui/material";
import Box from "@mui/material/Box";
import { useGreetingData } from "./GreetingDataContext";
import { useMapInput } from "../context/MapInputContext";

const LoginCheck = ({children}) => {
  let errorTimer;
  let passTimer;

  const { setUserdata } = useMapInput();
  const { setTemp1, setTemp2 } = useGreetingData();

  const navigate = useNavigate();
  const togglehomepage = () => {
    navigate("/");
  };

  const [errorVisible, seterrorVisible] = useState(false);
  const [passVisible, setpassVisible] = useState(false);
  const [errorMessage, seterrorMessage] = useState("");
  const [passMessage, setpassMessage] = useState("");

  const [value1, setvalue1] = useState("");
  const [value2, setvalue2] = useState("");

  const handleClose_error = () => {
    seterrorVisible(false);
    seterrorMessage("");
  };

  const handleClose_pass = () => {
    setpassVisible(false);
    setpassMessage("");
  };


  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    console.log(username, password);
    e.preventDefault();
    setError("");
    // Clear previous timers before setting new ones
    clearTimeout(errorTimer);
    clearTimeout(passTimer);

    // Make the POST request to the logincheck endpoint
    axios
      .post("users/logincheck", { username, password })

      .then((response) => {
        // Check with database if the username and password match up
        const check = response.data["checks"];
        setUserdata(check); 
        console.log(
          "Do the username and password match up =",
          check
        );
        if (response.data["checks"][0] == true) {
          
    
          const  address = response.data["checks"][3]
          console.log("Hi", response.data["checks"][1], "and welcome back!");
          const text_pass =
            "Sign in successful!  Hi " +
            response.data["checks"][1] +
            // " of " +
            // response.data["checks"][2] +
            // response.data["checks"][3] +
            ". Welcome back!";

const temp1=response.data["checks"][1];
const temp2=response.data["checks"][2];

console.log(temp1)
          console.log(temp2)
          setTemp1(temp1);
          setTemp2(temp2);

          // setvalue1(temp1);
          // setvalue2(temp2 );
          

          // const value1=response.data["checks"][1];
          // const value2=response.data["checks"][2];

          // console.log(value1)
          // console.log(value2)

        

          setpassMessage(text_pass);
          setpassVisible(true);
          passTimer = setTimeout(handleClose_pass, 5000);
          setTimeout(() => {
            navigate("/");
          }, 3000);
        } else {
          console.log("Username and password do not match.  Please try again");
          seterrorMessage(
            "Username and password do not match.  Please try again"
          );
          seterrorVisible(true);
          errorTimer = setTimeout(handleClose_error, 5000);
        }
      })
      .catch((error) => {
        // Handle login error
        setError("Invalid email or password");
        seterrorMessage("Invalid email or password");
        seterrorVisible(true);
        errorTimer = setTimeout(handleClose_error, 5000);
        console.log("Error:", error.response.data.error);
       
      });
  };

  return (



    <div className="login-area-signin">
      <div
        className="additional-block-close-loginCheck"
        onClick={togglehomepage}
      >
        <CloseIcon sx={{ fontSize: 35, color: "white" }} />
      </div>
      <div>
        {errorVisible && <Alert severity="error">{errorMessage}</Alert>}

        {passVisible && <Alert severity="success">{passMessage}</Alert>}
        <h1 className="signin-text1">Sign in to your account</h1>
        <p className="signin-text2">
          Don't have an account yet?{" "}
          <Link to="/login" className="signin-text3">
            Sign up.
          </Link>
        </p>
      </div>

      <form className="form-signin" onSubmit={handleLogin}>
        <div className="usernamebox-signin">
          <label className="emaillabel-signin">Username (Email):</label>
          <input
            className="username-signin"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="passwordbox-signin">
          <label className="passwordlabel-signin">Password:</label>
          <input
            className="password-signin"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="wrapper-function-signin">
          <a
            className="wrapper-function-text-signin"
            onClick={handleLogin}
            href="#"
            type="submit"
          >
            <span>Sign In</span>
          </a>
        </div>
      </form>
    </div>
  );
};
// export const check = response.data["checks"];
export default LoginCheck;
