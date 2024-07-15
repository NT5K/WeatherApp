import React from 'react';
import { WeatherResponse } from '../types/types';
import HourlyForecast from './HourlyForecast/HourlyForecast';
import DailyForecast from './DailyForecast';

// Define props interface for WeatherDisplay component
interface WeatherDisplayProps {
    // Weather data
    weatherData: WeatherResponse;
    // Temperature unit
    tempUnit: "F" | "C";
}

// WeatherDisplay component
const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ weatherData, tempUnit }) => {
    return (
        <div className="weather-data">
            {/* Display matched address */}
            <h2 className="text-center mb-4">
                Weather for {weatherData.matchedAddress}
            </h2>
            {/* Display coordinates */}
            <p className="text-center text-muted mb-4">
                Coordinates: {weatherData.coordinates.latitude.toFixed(4)},{" "}
                {weatherData.coordinates.longitude.toFixed(4)}
            </p>

            {/* Render HourlyForecast component */}
            <h2 className="h4 mb-3 text-center">24-Hour Forecast</h2>
            <HourlyForecast hourlyForecast={weatherData.hourlyForecastPeriods} tempUnit={tempUnit} />

            {/* Render DailyForecast component */}
            <h2 className="h4 mb-3 text-center">7-Day Forecast</h2>
            <DailyForecast forecastPeriods={weatherData.forecastPeriods} tempUnit={tempUnit} />
        </div>
    );
};

export default WeatherDisplay;