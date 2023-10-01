
import React, { useRef, useEffect, useState,useContext } from 'react';
import {Link, useNavigate} from 'react-router-dom';

import { createTheme,ThemeProvider  } from '@mui/material/styles';

import MenuBar from './MenuBar';
import './Mobile_homepage.css';
import MyButton2 from './mainbutton2';
import MyFunctionButton from './functionbutton';
import MapBackground from './mapbackground';
import Box from "@mui/material/Box";

const theme = createTheme({
    palette: {
      primary: {
        main: '#004d40',
      },
      secondary: {
        main: '#004d40',
      },
    },
  });


  
  function Mobile_homepage() {
    const navigate=useNavigate();
    const [logoIndex, setLogoIndex] = useState(0);

    const handleButtonClick = () =>{
        navigate('/interface-two')
    }

    const logoImages = [
      "/static/images/LO1.png",
    
      // Add more logo image paths here if needed
    ];
    

    useEffect(() => {
      const interval = setInterval(() => {
        setLogoIndex((prevIndex) => (prevIndex + 1) % logoImages.length);
      }, 80); // Change logo every 3 seconds (adjust this interval as needed)
  
      return () => {
        clearInterval(interval);
      };
    }, []);

    const togglehome = () => {
      navigate("/realhomepage");
    };
  
    const toggleamble = () => {
      navigate("/mobilemappage");
    };
    return (
      <>
      <MenuBar />
      <div className='mobilehomepage-pics-container'>
      <div className='mobilehomepage-contain'>
        
      <img
            src={logoImages[logoIndex]}
            className="Logo-amble-mobile"
            alt="Logo"
            
          />
        
       
          <span className='mobile-hometext'> 
          <span style={{ fontSize: '26px' ,fontWeight: 550}}>the peaceful way</span>
          <br></br>

          </span>
          <div className='mobile-homebut'>
          <MyButton2 />
       </div>
        
      </div>
      </div>
      </>
    );
  }

  export default Mobile_homepage;