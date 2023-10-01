import React, { useState } from "react";
import axios from "axios";
import "./login.css";
import CloseIcon from "@mui/icons-material/Close";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { Alert, AlertTitle } from "@mui/material";
import Box from "@mui/material/Box";

const Login = () => {
  let errorTimer;
  let passTimer;

  const navigate = useNavigate();

  const [errorVisible, seterrorVisible] = useState(false);
  const [passVisible, setpassVisible] = useState(false);
  const [errorMessage, seterrorMessage] = useState("");
  const [passMessage, setpassMessage] = useState("");

  const handleClose_error = () => {
    seterrorVisible(false);
    seterrorMessage("");
  };

  const handleClose_pass = () => {
    setpassVisible(false);
    setpassMessage("");
  };


  const togglehomepage = () => {
    navigate("/");
  };

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    address: "",
    password: "",
  });

  const errorMessageElement = document.getElementById("error-message");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    axios
      .post("/users/registration", formData, {
        // Need this header as axios sends Form data as application/json which is not compatible with django request.POST
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response) => {
        console.log(response);
        setpassVisible(true);
        setpassMessage("Dear user, your registration is successful!");
        passTimer = setTimeout(handleClose_pass, 5000);
        setTimeout(() => {
          navigate("/");
        }, 3000);
      })
      .catch((error) => {
        if (error.response.status === 400) {
          console.log("It may be that Username already exists.");
          seterrorMessage(
            "Username already exists! Please try entering a different email."
          );
          seterrorVisible(true);
          errorTimer = setTimeout(handleClose_error, 5000);
         
        } else if (error.response) {
          console.log(error.response);
          console.log("server responded");
          seterrorMessage(error.response);
          seterrorVisible(true);
          errorTimer = setTimeout(handleClose_error, 5000);
        } else if (error.request) {
          console.log("network error");
          seterrorMessage(error.request);
          seterrorVisible(true);
          errorTimer = setTimeout(handleClose_error, 5000);
        } else {
          console.log(error);
          seterrorMessage(error);
          seterrorVisible(true);
          errorTimer = setTimeout(handleClose_error, 5000);
        }
      });
  };

  return (
    <div>
      <div className="login-area-signup">
        <div className="additional-block-close-login" onClick={togglehomepage}>
          <CloseIcon sx={{ fontSize: 35, color: "white" }} />
        </div>

        <div>
        

          {errorVisible && (
            <Alert severity="error" >
              {errorMessage}
            </Alert>
          )}

          {passVisible && (
            <Alert severity="success" >
              {passMessage}
            </Alert>
          )}
          <h1 className="signup-text1">Sign up for a free account</h1>
          <p className="signup-text2">
            Already have an account yet?{" "}
            <Link to="/loginCheck" className="signup-text3">
              Sign in.
            </Link>
          </p>
        </div>
        <form className="form-signup" onSubmit={handleSubmit}>
          <div className="firstnamebox-signup">
            <label
              className="first_namelabel-signup"
              htmlFor="first_name"
            >
              First Name:
            </label>
            <input
              type="text"
              name="first_name"
              className="first_name-signup"
              id="first_name"
              // value={formData.first_name}
              onChange={handleChange}
            ></input>
          </div>
          <div className="lastnamebox-signup">
            <label className="last_namelabel-signup" htmlFor="last_name">
              Last Name:
            </label>
            <input
              type="text"
              name="last_name"
              className="last_name-signup"
              // value={formData.last_name}
              onChange={handleChange}
            ></input>
          </div>

          <div className="usernamebox-signup">
            <label className="usernamelabel-signup" htmlFor="username">
              Email (will be your username):
            </label>
            <input
              type="text"
              name="username"
              className="username-signup"
              id="username"
              // value={formData.email}
              onChange={handleChange}
            ></input>
          </div>

          <div className="addressbox-signup">
            <label className="addresslabel-signup" htmlFor="address">
              Address:
            </label>
            <input
              type="text"
              name="address"
              className="address-signup"
              id="address"
              // value={formData.address}
              onChange={handleChange}
            ></input>
          </div>
          <div className="passwordbox-signup">
            <label className="passwordlabel-signup" htmlFor="password">
              Password:
            </label>
            <input
              type="text"
              name="password"
              className="password-signup"
              id="password"
              // value={formData.password}
              onChange={handleChange}
            ></input>
          </div>

          <div className="wrapper-function-login">
            <a
              className="wrapper-function-text-login"
              href="#"
              type="submit"
              onClick={handleSubmit}
            >
              <span>Sign Up</span>
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
