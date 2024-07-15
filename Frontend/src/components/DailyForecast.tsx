// Import necessary dependencies and components
import React from 'react';
import { ForecastPeriod } from '../types/types';
import ForecastCard from './ForecastCard';

// Define interface for consolidated forecast
interface ConsolidatedForecast {
    // Day forecast period
    day?: ForecastPeriod;
    // Night forecast period
    night?: ForecastPeriod;
}

// Define props interface for DailyForecast component
interface DailyForecastProps {
    // Array of forecast periods
    forecastPeriods: ForecastPeriod[];
    // Temperature unit
    tempUnit: "F" | "C";
}

// DailyForecast component
const DailyForecast: React.FC<DailyForecastProps> = ({ forecastPeriods, tempUnit }) => {
    // Function to consolidate forecast periods into day/night pairs
    const consolidateForecast = (periods: ForecastPeriod[]): ConsolidatedForecast[] => {
        // Initialize consolidated forecast array
        const consolidated: ConsolidatedForecast[] = [];
        // Initialize flag to check if it's the first day
        let isFirstDay = true;
        // Loop through forecast periods
        for (let i = 0; i < periods.length; i += 2) {
            // Get day and night periods
            const day = periods[i];
            const night = periods[i + 1];
            // Consolidate day and night periods
            if (isFirstDay && !day.isDaytime) {
                // If it's the first day and the first period is night
                // then consolidate the night period only
                consolidated.push({ night });
                // Decrement the index to process the day period next
                isFirstDay = false;
                // Skip the next iteration
                i -= 1;
            } else {
                // If it's not the first day or the first period is day
                // then consolidate both day and night periods
                consolidated.push({ day, night });
                // Reset the flag
                isFirstDay = false;
            }
        }
        return consolidated;
    };

    // Consolidate the forecast periods
    const consolidatedForecast = consolidateForecast(forecastPeriods);

    return (
        <div className="row row-cols-1 row-cols-md-2 g-4 mb-4">
            {/* Map through consolidated forecast and render ForecastCard for each day */}
            {consolidatedForecast.map((forecast, index) => (
                <div key={index} className="col">
                    <div className="card h-100 shadow-sm">
                        <div className="card-header bg-primary text-white text-center">
                            {/* Display day/night label */}
                            <h5 className="card-title mb-0">
                                {index === 0
                                    ? forecast.day
                                        ? "Today"
                                        : "Tonight"
                                    : forecast.day?.name || forecast.night?.name}
                            </h5>
                        </div>
                        <div className="card-body p-2">
                            <div className="row g-2">
                                {/* Render day forecast if available */}
                                {forecast.day && (
                                    <div className={`col${forecast.night ? "-6" : ""}`}>
                                        <ForecastCard period={forecast.day} isDay={true} tempUnit={tempUnit} />
                                    </div>
                                )}
                                {/* Render night forecast if available */}
                                {forecast.night && (
                                    <div className={`col${forecast.day ? "-6" : ""}`}>
                                        <ForecastCard period={forecast.night} isDay={false} tempUnit={tempUnit} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DailyForecast;