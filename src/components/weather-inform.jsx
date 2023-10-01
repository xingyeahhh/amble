import "./weather-inform.css"

const Weatherinform=({data})=>{
    
    return(
        <div className="weather">
            <div className="top">
            <img alt="weather" className="weather-icon" src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}/>
            <p className="temperature">{Math.round(data.main.temp)}°C</p>
            </div>
            <div className="parameter-row">
            <p className="weather-description">{data.weather[0].description}</p> 
            </div>

            <div className="parameter-row">
            <span className="parameter-label">Feels like</span> 
            <div>
            <span className="parameter-value">{Math.round(data.main.feels_like)}°C</span> 
            </div>
            </div>

            <div className="parameter-row">
            <span className="parameter-label">Wind</span> 
            <div>
            <span className="parameter-value">{data.wind.speed} m/s</span> 
            </div>
            </div>

            <div className="parameter-row">
            <span className="parameter-label">Humidity</span> 
            <div>
            <span className="parameter-value">{data.main.humidity}%</span> 
            </div>
            </div>


            {/* <div className="parameter-row">
            <span className="parameter-label">Pressure</span> 
            <span className="parameter-value">{data.main.pressure} hPa</span> 
            </div> */}
        </div>
    );
}


export default Weatherinform;