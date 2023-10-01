import React, { useRef, useEffect, useState,useContext } from 'react';

import Quotes from './quotes';
import ChatGPT from './chatgpt';
import Carbon from './carbon_calculator';
import './resources.css';
import axios from "axios";
import "./login.css";
import CloseIcon from "@mui/icons-material/Close";
import { UserAuth } from "../context/AuthContext";
import { Alert, AlertTitle } from "@mui/material";

import {Link, useNavigate} from 'react-router-dom';
import { createTheme,ThemeProvider  } from '@mui/material/styles';
import MenuBar2 from './MenuBar2';
import MyButton from './mainbutton';
import MyFunctionButton from './functionbutton';
import MapBackground from './mapbackground';
import Box from "@mui/material/Box";

const Resources = () => {
const navigate=useNavigate();
  const togglehomepage = () => {
    navigate("/");
  };

    return (
        <div className="resource-area">
        <div className="additional-block-close-res" onClick={togglehomepage}>
          <CloseIcon sx={{ fontSize: 35, color: "white" }} />
        </div>
        <div className='r-b1'>  
        <Quotes />
        </div>

        <div className='r-b2'>
 <ChatGPT />
        </div>

        <div className='r-b3'>
<Carbon />
        </div>

    
        <div className="attribution-text">
          Get a Reflection from 'They Said So' : Learn Something Interesting powered by OpenAI : Your amble Trees from savingnature.com
      </div>
      </div>
    );
  };
  
  export default Resources;