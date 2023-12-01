// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_KEY = '800de0e68f8c3e1a3c70668b5bd53c34';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [weatherDataWeekly, setWeatherDataWeekly] = useState(null);
  const [city, setCity] = useState('Toronto');

  //get API fetch data
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
      );
      setWeatherData(response.data);
      fetchDataWeekly(response.data.coord.lon, response.data.coord.lat)
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  //get API fetch data
  const fetchDataWeekly = async (lon, lat) => {
    try {
      const response = await axios.get(
        `http://api.openweathermap.org/data/2.5/forecast/?lat=${lon}&lon=${lat}&cnt=7&appid=${API_KEY}`
      );
      setWeatherDataWeekly(response.data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  //first call
  useEffect(() => {
    fetchData();
  }, [])

  //enter keydown, fetch data
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      fetchData();
    }
  };

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDayName = (timestamp) => {
    const date = new Date(timestamp * 1000);
    let hour = date.getHours()
    let minute = date.getMinutes()
    if(hour<10){ hour='0'+hour }
    if(minute<10){ minute='0'+minute }

    return daysOfWeek[date.getDay()]+' '+ hour +':'+minute;
  };

  return (
    <div className="App">
      <h1>Weather App</h1>

      {weatherData && (

        <div className="weather-container">

          <div className="App">
            <div className="two-column-layout">
              {/* Left Column: Weather Information */}
              <div className="left-column">

                <div className="weather-info">
                  {/* First Line: Day Name */}
                  <div className="day-name">
                    {new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date())}
                  </div>

                  {/* Second Line: Today's Date */}
                  <div className="date">
                    {new Intl.DateTimeFormat('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    }).format(new Date())}
                  </div>

                  {/* Third Line: City and Region */}
                  <div className="location">
                    {weatherData.name}, {weatherData.sys.country}
                  </div>

                  {/* Fourth Line: Weather Icon */}
                  <img
                    src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                    alt="Weather Icon"
                    className="weather-icon"
                  />

                  {/* Fifth Line: Temperature */}
                  <div className="temperature">
                    <span className="large-font">{(weatherData.main.temp - 273.15).toFixed(0)*1}</span>
                    <span className="unit">°C</span>
                  </div>

                  {/* Sixth Line: Weather Description */}
                  <div className="description">{weatherData.weather[0].description}</div>
                </div>

              </div>

              {/* Right Column: Other Content */}
              <div className="right-column">
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e)}
                  placeholder="Write city and press enter key"
                  className='citybox'
                />
                <br />

                <div className='weekly-day-boxs'>
                  {weatherDataWeekly?.list?.slice(0, 7).map((day,i) => (
                    <div
                      key={day.dt}
                      className={`weekly-day-box weekly-${i} ${getDayName(day.dt) === daysOfWeek[new Date().getDay()] ? 'current-day' : 'other-day'}`}
                    >
                      {/* Weather Icon */}
                      <div className="icon">
                        <img
                          src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                          alt="Weather Icon"
                          className="weather-icon"
                        />
                      </div>

                      {/* Day Name */}
                      <div className="day">{getDayName(day.dt)}</div>

                      {/* Temperature */}
                      <div className="temperature">
                      {(day.main.temp - 273.15).toFixed(0)} °C
                      </div>
                    </div>
                  ))}
                </div>

                {/* UV Index and Humidity */}
                <div className="extra-info">
                  <div className="info">
                    <span>Wind</span>
                    <span>{weatherData?.wind?.speed} km/h</span>
                  </div>
                  <div className="info">
                    <span>Humidity</span>
                    <span>{weatherData?.main?.humidity} %</span>
                  </div>
                  <div className="info">
                    <span>Min Temp</span>
                    <span>{(weatherData?.main.temp_min - 273.15).toFixed(0)} °C</span>
                  </div>
                  <div className="info">
                    <span>Max Temp</span>
                    <span>{(weatherData?.main.temp_max - 273.15).toFixed(0)} °C</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

      )}
    </div>

  );
}

export default App;
