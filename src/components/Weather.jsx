import './Weather.css';
import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import wind_icon from '../assets/wind.png';
import humidity_icon from '../assets/humidity.png';
import { useEffect, useRef, useState } from 'react';

const Weather = () => {
    // State to store weather data; initialized as `false` when no data is available
    const [weatherData, setWeatherData] = useState(false);

    // Ref for the search input field
    const inputRef = useRef();

    // Map weather condition codes to corresponding icons
    const allIcons = {
        "01d": clear_icon, "01n": clear_icon,
        "02d": cloud_icon, "02n": cloud_icon,
        "03d": cloud_icon, "03n": cloud_icon,
        "04d": drizzle_icon, "04n": drizzle_icon,
        "09d": rain_icon, "09n": rain_icon,
        "10d": rain_icon, "10n": rain_icon,
        "13d": snow_icon, "13n": snow_icon,
    };

    // OpenWeatherMap API key
    const apiKey = '933f6db548baa1ea5fac7a157ac84e52';

    // Function to fetch weather data for a given city
    const search = async (city) => {
        if (!city) {
            alert("Enter City Name");
            return;
        }

        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            // Extract relevant weather data and update state
            const icon = allIcons[data.weather[0].icon] || clear_icon;
            setWeatherData({
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                temperature: Math.floor(data.main.temp),
                location: data.name,
                icon: icon,
            });
        } catch (error) {
            console.error('Error fetching weather data:', error);
            setWeatherData(false); // Reset state in case of error
        }
    };

    // Fetch default weather data for Tokyo on initial load
    useEffect(() => {
        search("Tokyo");
    }, []);

    return (
        <div className="weather">
            {/* Search bar */}
            <div className="search-bar">
                <input ref={inputRef} type="text" placeholder="Search" />
                <img
                    src={search_icon}
                    alt="Search"
                    onClick={() => search(inputRef.current.value)}
                />
            </div>

            {/* Display weather data if available */}
            {weatherData ? (
                <>
                    <img src={weatherData.icon} alt="Weather Icon" className="weather-icon" />
                    <p className="temperature">{weatherData.temperature}°C</p>
                    <p className="location">{weatherData.location}</p>
                    <div className="weather-data">
                        {/* Humidity */}
                        <div className="col">
                            <img src={humidity_icon} alt="Humidity Icon" />
                            <div>
                                <p>{weatherData.humidity} %</p>
                                <span>Humidity</span>
                            </div>
                        </div>
                        {/* Wind Speed */}
                        <div className="col">
                            <img src={wind_icon} alt="Wind Speed Icon" />
                            <div>
                                <p>{weatherData.windSpeed} km/h</p>
                                <span>Wind Speed</span>
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    );
};

export default Weather;
