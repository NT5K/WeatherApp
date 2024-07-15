import React from 'react';
import { ForecastPeriod } from '../types/types';

// Define props interface for ForecastCard component
interface ForecastCardProps {
    // Forecast period
    period: ForecastPeriod;
    // Flag to indicate if it's day or night
    isDay: boolean;
    // Temperature unit
    tempUnit: "F" | "C";
}

// ForecastCard component
const ForecastCard: React.FC<ForecastCardProps> = ({ period, isDay, tempUnit }) => {
    // Function to convert temperature between Fahrenheit and Celsius
    const convertTemperature = (temp: number, from: "F" | "C", to: "F" | "C"): number => {
        if (from === to) return temp;
        if (from === "F" && to === "C") return Math.round(((temp - 32) * 5) / 9);
        return Math.round((temp * 9) / 5 + 32);
    };

    return (
        <div className="card h-100 border-0">
            <div className="card-body p-2 text-center">
                {/* Display day/night label */}
                <h6 className="text-muted mb-2">{isDay ? "Day" : "Night"}</h6>
                {/* Display weather icon */}
                <img
                    src={period.icon}
                    alt={period.shortForecast}
                    style={{ width: "60px", height: "60px" }}
                    className="mb-2 mx-auto d-block"
                />
                {/* Display temperature */}
                <p className="h4 mb-3">
                    {convertTemperature(period.temperature, "F", tempUnit)}°{tempUnit}
                </p>
                {/* Display short forecast */}
                <h6 className="mb-1 item">Description</h6>
                <p className="mb-3 small">{period.shortForecast}</p>
                {/* Display wind information */}
                <h6 className="mb-1 item">Wind</h6>
                <p className="mb-3 small">
                    {period.windSpeed} {period.windDirection}
                </p>
                {/* Display precipitation probability */}
                <h6 className="mb-1 item">Precipitation</h6>
                <p className="mb-0 small">
                    {period.probabilityOfPrecipitation.value ?? 0}%
                </p>
            </div>
        </div>
    );
};

export default ForecastCard;