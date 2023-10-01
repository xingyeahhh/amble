import React, { useRef, useEffect, useState, useContext } from 'react';
import Map from "./Map_original";
import "./ShowRoute.css";

import StarOutlineIcon from '@mui/icons-material/StarOutline';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import { createTheme,ThemeProvider  } from '@mui/material/styles';
import { WEATHER_API_KEY,WEATHER_API_URL } from './api';
import Weatherinform from './weather-inform';
// import TimeSearchContext from './timesearch_context';
import MenuBar from './MenuBar';
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



function ShowRoute() {
  // const timeData=useContext(TimeSearchContext); 
  // console.log(timeData);

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
    weatherdata(); // 在组件挂载时调用weatherdata函数
  }, []); // 空数组作为第二个参数，确保只在挂载时运行一次

  console.log(currentWeather);
  console.log(forecast);


  return (
    <ThemeProvider theme={theme}>
      <div>
      <MenuBar/>
      <div className='mapwrapper_showroute'>
        <MapBackground zoom={15.5}/>
        </div>
        <div className="PlanWin">
          
        <div className="green-weather-block">
          {/* <AcUnitIcon sx={{ fontSize: 38 }}/>
        <span className="text_bar_4">Snow</span>
        
        <span className="text_bar_5">-2­°C</span> */}
        {currentWeather && <Weatherinform data={currentWeather}/>}

        </div>
          <div className="PlanMap">

            <div className="button-group-1">
              <Button
                variant="contained"
                style={{ borderRadius: 0 }}
                sx={{ width: "270px", height: "2.8rem" }}
                size="small"
                color="primary"
              >
                Route Information
              </Button>

              <Button
                variant="contained"
                style={{ borderRadius: 0 }}
                sx={{ width: "270px", height: "2.8rem" }}
                size="small"
                color="primary"
              >
                General Information
              </Button>
            </div>

            <div className="additional-blocks">
              <div className="additional-block-text">
                <span className="text_bar_2">Regernate Plan</span>
                {/* <Button
                variant="contained"
                style={{ borderRadius: 0 }}
                sx={{ width: "10rem", height: "2.8rem" }}
                size="small"
                color="primary"
              >
                Regernate Plan
              </Button> */}
              </div>
              <div className="additional-block-favorite">
                <FavoriteBorderIcon sx={{ fontSize: 24, color:'white'  }} />
              </div>
              <div className="additional-block-close">
                <CloseIcon sx={{ fontSize: 26, color:'white' }} />
              </div>
            </div>
            <Map />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default ShowRoute;


