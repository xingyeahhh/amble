import {
    Accordion,AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
  } from "react-accessible-accordion";
  import "./currentweather-preplan.css"
  import Box from "@mui/material/Box";
  
  const Current_w = ({ data }) => {
    return (
      <>
        <label className="title">Current</label>
        <Accordion allowZeroExpanded>       
            <AccordionItem>
              <AccordionItemHeading>
                <AccordionItemButton>
                  <div className="daily-item">
                    <img
                      alt="weather"
                      className="icon-small"
                      src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                    />
                    <label className="Date">Now</label>
                    <label className="weather-general">
                      {data.weather[0].main}
                    </label>
                    <label className="min-max">
                      {Math.round(data.main.temp_min)}°C/
                      {Math.round(data.main.temp_max)}°C
                    </label>
                  </div>
                </AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel> 
                  <div className="daily-details-grids">
                  <div className="daily-details-grids-item">
                    <label className="d-title">Description:</label>
                    <label className="content">{data.weather[0].description}</label>
                    </div>
                  <div className="daily-details-grids-item">
                      <label className="d-title">Pressure:</label>
                      <label className="content">{data.main.pressure} hPa</label>
                      </div>
                      <div className="daily-details-grids-item">
                      <label className="d-title">Humidity:</label>
                      <label className="content">{data.main.humidity}%</label>
                      </div>
                      <div className="daily-details-grids-item">
                      <label className="d-title">Clouds:</label>
                      <label className="content">{data.clouds.all}%</label>
                      </div>
                      <div className="daily-details-grids-item">
                      <label className="d-title">Wind speed:</label>
                      <label className="content">{data.wind.speed} m/s</label>
                      </div>
                      <div className="daily-details-grids-item">
                      <label className="d-title">Feels like:</label>
                      <label className="content">{data.main.feels_like}°C</label>
                      </div>
                  </div>
                  
              </AccordionItemPanel>
            </AccordionItem>
          
        </Accordion>
      </>
    );
  };
  
  export default Current_w;
  