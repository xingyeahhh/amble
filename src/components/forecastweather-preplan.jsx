import {
    Accordion,AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
  } from "react-accessible-accordion";
  import "./forecastweather-preplan.css"
  import Box from "@mui/material/Box";
  
  const Forecast = ({ data }) => {

    return (
      <>
        <label className="title">Future Three Days</label>
        <div style={{ overflow: "auto" }}>
        <Accordion allowZeroExpanded>
          {data.list.slice(0, 24).map((item, idx) => (
            // console.log(item),
            <AccordionItem key={idx}>
              <AccordionItemHeading>
                <AccordionItemButton>
                  <div className="daily-item">
                    <img
                      alt="weather"
                      className="icon-small"
                      src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                    />
                    <label className="Date">{item.dt_txt}</label>
                    <label className="weather-general">
                      {item.weather[0].main}
                    </label>
                    <label className="min-max">
                      {Math.round(item.main.temp_min)}°C/
                      {Math.round(item.main.temp_max)}°C
                    </label>
                  </div>
                </AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel> 
                  <div className="daily-details-grids">
                  <div className="daily-details-grids-item">
                      <label className="d-title">Description:</label>
                      <label className="content">{item.weather[0].description}</label>
                      </div>
                  <div className="daily-details-grids-item">
                      <label className="d-title">Pressure:</label>
                      <label className="content">{item.main.pressure} hPa</label>
                      </div>
                      
                      <div className="daily-details-grids-item">
                      <label className="d-title">Humidity:</label>
                      <label className="content">{item.main.humidity}%</label>
                      </div>
                      <div className="daily-details-grids-item">
                      <label className="d-title">Clouds:</label>
                      <label className="content">{item.clouds.all}%</label>
                      </div>
                      <div className="daily-details-grids-item">
                      <label className="d-title">Wind speed:</label>
                      <label className="content">{item.wind.speed} m/s</label>
                      </div>
                      <div className="daily-details-grids-item">
                      <label className="d-title">Feels like:</label>
                      <label className="content">{item.main.feels_like}°C</label>
                      </div>
                  </div>
                  
              </AccordionItemPanel>
            </AccordionItem>
          ))}
        </Accordion>
        </div>
      </>
    );
  };
  
  export default Forecast;
  
  
  
  
  
  