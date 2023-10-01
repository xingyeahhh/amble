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
import MenuBar2 from './MenuBar2';
import MapBackground from './mapbackground';
import {Link, useNavigate} from 'react-router-dom';
import MyFunctionButton from './functionbutton';
import Map from "./Map";
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

function Interface2() {
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
    document.querySelector(".popup-overlay").classList.add("hide");
    document.querySelector(".additional-blocks-weather").classList.add("hide");
    document.querySelector(".additional-block-close-weather").classList.add("hide");
    document.querySelector(".w_current").classList.add("hide");
    document.querySelector(".overlay-weatherwin").classList.add("hide");
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
          <div className="menubar-area-interface">
        <MenuBar2 />
      </div>
         <div className='mapwrapper_routeplan'>
         <img
              src="/static/images/newyork.jpg"
              alt="pics"
              className="pic-in-rightbox"
            ></img>
        </div>
        {isWeatherVisible && (
            <>
            <div className="popup-overlay">
              <div className="additional-blocks-weather">
              <div className="additional-block-text-preplan-weatherwin">
                <span className="text_bar_2-preplan-weatherwin">Weather Information</span>
              </div>
              <div className="additional-block-close-weather" onClick={toggleWeather}>
                <CloseIcon sx={{ fontSize: 27 , color: 'white' }} />
              </div>
            </div>

            <div className="w_current">
            {currentWeather && <Current_w data={currentWeather}/>}
            {forecast && <Forecast data={forecast}/>}
            </div>
            </div>
            </>
          )}
        {isWeatherVisible && (<div className="overlay-weatherwin"></div> )}

        <div className="PlanWin">
        

          <div className="PlanMap">
            <div className="additional-blocks">
              <div className="additional-block-text-preplan-web">
                <span className="text_bar_2-preplan">Plan Process</span>
              </div>
              <div
                className="additional-block-weather"
                onClick={toggleWeather}
              >
                <CloudIcon sx={{ fontSize: 24 , color: 'white'}} />
              </div>
              <div className="additional-block-close" onClick={handleButtonClick_close}>
                <CloseIcon sx={{ fontSize: 27 , color: 'white'}} />
              </div>
            </div>
        
            <Map />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default Interface2;


