
import TuneIcon from '@mui/icons-material/Tune';
import MapIcon from '@mui/icons-material/Map';
import React, { useRef, useEffect, useState,useContext } from 'react';
// import Map from "./Map_original";
import "./interface2.css";
// import StartPlace from "./components/start_place";
import StartTime from './start_time';
import Preference from './preference';
import Distance from './walk_distance';
import CloseIcon from '@mui/icons-material/Close';
import { createTheme,ThemeProvider  } from '@mui/material/styles';
import { WEATHER_API_KEY,WEATHER_API_URL } from './api';
// import { TimeSearchContext } from './start_time';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import CloudIcon from '@mui/icons-material/Cloud';
import Forecast from './forecastweather-preplan';
import Current_w from './currentweather-preplan';
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined';
import WidgetsRoundedIcon from '@mui/icons-material/WidgetsRounded';
import WidgetsIcon from '@mui/icons-material/Widgets';
import FaceIcon from '@mui/icons-material/Face';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuBar from './MenuBar';
import MapBackground from './mapbackground';
import {Link, useNavigate} from 'react-router-dom';
import MyFunctionButton from './functionbutton';
import Map_Mobile from './Map_Mobile';
import Box from "@mui/material/Box";
import './Mobile_Mappage.css';
import Map from './Map';


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

function Mobile_Mappage() {
//   const timeData=useContext(TimeSearchContext); 
//   console.log(timeData.search);

    const navigate_homepage=useNavigate();

    const handleButtonClick_close = () =>{
        navigate_homepage('/')
    }


  const handleOnSearchChange=(searchData)=>{
    console.log(searchData);
    // console.log(timeData.search);
  }


  const [isWeatherVisible, setIsWeatherVisible] = useState(false);
  const toggleWeather = () => {
    if (!isWeatherVisible) {
      setIsWeatherVisible(true);
    } else {
      exitWeather();
      setTimeout(() => {
        setIsWeatherVisible(false);
      }, 1000);
    }
  };

  const exitWeather = () => {
    // 其他逻辑
    hideElements_weather();
  };

  const hideElements_weather = () => {
    document.querySelector(".popup-overlay-m").classList.add("hide");
    // document.querySelector(".additional-blocks-weather-mobile").classList.add("hide");
    document.querySelector(".additional-block-close-weather-mobile").classList.add("hide");
    document.querySelector(".w_current-mobile").classList.add("hide");
    document.querySelector(".overlay-weatherwin-m").classList.add("hide");
  };

  const [currentWeather,setCurrentWeather]=useState(null);
  const [forecast,setForecast]=useState(null);

  const weatherdata=()=>{
    const currentWeatherFetch=fetch(`https://${WEATHER_API_URL}/weather?lat=40.776676&lon=-73.971321&appid=${WEATHER_API_KEY}&units=metric`);//write full url
    const forecastFetch=fetch(`https://${WEATHER_API_URL}/forecast?lat=40.776676&lon=-73.971321&appid=${WEATHER_API_KEY}&units=metric`);
    Promise.all([currentWeatherFetch,forecastFetch])
    .then(async(response)=>{
      const weatherResponse=await response[0].json();
      const forecastResponse=await response[1].json();

      setCurrentWeather(weatherResponse);
      setForecast(forecastResponse);
    })
    .catch((error)=>console.log(error));
  }

  useEffect(() => {
    weatherdata(); 
  }, []); 

  console.log(currentWeather);
  console.log(forecast);


  return (
    <ThemeProvider theme={theme}>
      <div>
          <div className="menubar-area-interface-mobile">
        <MenuBar />
        <div
                className="additional-block-weather-mobile"
                onClick={toggleWeather}
              >
                <CloudIcon sx={{ fontSize: 23 , color: 'white'}} />
              </div>
            
      </div>
         <div className='mapwrapper_routeplan'>
         <img
              src="/static/images/newyork11.png"
              alt="pics"
              className="pic-in-rightbox"
            ></img>
        </div>
        {isWeatherVisible && (
            <>
            <div className="popup-overlay-m ">
              <div className="additional-blocks-weather-mobile ">
              
              <div className="additional-block-close-weather-mobile " onClick={toggleWeather}>
                <CloseIcon sx={{ fontSize: 27 , color: 'white' }} />
              </div>
            </div>

            <div className="w_current-mobile">
            {currentWeather && <Current_w data={currentWeather}/>}
            {forecast && <Forecast data={forecast}/>}
            </div>
            </div>
            </>
          )}
        {isWeatherVisible && (<div className="overlay-weatherwin-m"></div> )}

        <div className="PlanWin-mobile">
        

          <div className="PlanMap-mobile">
            <div className="additional-blocks">
             
              {/* <div
                className="additional-block-weather"
                onClick={toggleWeather}
              >
                <CloudIcon sx={{ fontSize: 24 , color: 'white'}} />
              </div> */}
            
            </div>
        
            <Map_Mobile/>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default Mobile_Mappage;



