import React, { useState, useRef, useEffect } from 'react';
import { ForecastPeriod } from '../../types/types';
import './HourlyForecast.css';

interface HourlyForecastProps {
    // Forecast data
    hourlyForecast: ForecastPeriod[];
    // Temperature unit
    tempUnit: "F" | "C";
}

const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourlyForecast, tempUnit }) => {
    // Ref for the scrollable forecast container
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    // State to show/hide left and right arrows
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    // Function to handle scroll event
    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
        }
    };

    // Add scroll event listener on component mount
    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScroll);
            return () => scrollContainer.removeEventListener('scroll', handleScroll);
        }
    }, []);

    // Function to scroll left
    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
        }
    };

    // Function to scroll right
    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
        }
    };

    // Function to convert date string to standard time format
    const convertToStandardTime = (dateString: string): string => {
        const date = new Date(dateString);
        return date
            .toLocaleString("en-US", { hour: "numeric", hour12: true })
            .replace(/\s/g, "");
    };

    // Function to convert temperature between Fahrenheit and Celsius
    const convertTemperature = (temp: number, from: "F" | "C", to: "F" | "C"): number => {
        if (from === to) return temp;
        if (from === "F" && to === "C") return Math.round(((temp - 32) * 5) / 9);
        return Math.round((temp * 9) / 5 + 32);
    };

    return (
        <div className="hourly-forecast-container d-flex align-items-center justify-content-between mb-4">
            {/* Left arrow */}
            <button
                className="btn btn-light me-2"
                onClick={scrollLeft}
                aria-label="Scroll left"
                disabled={!showLeftArrow}
            >
                &#9664;
            </button>

            {/* Scrollable forecast container */}
            <div className="hourly-forecast-wrapper flex-grow-1">
                <div
                    ref={scrollContainerRef}
                    className="hourly-forecast d-flex"
                >
                    {hourlyForecast.map((hour, index) => (
                        <div key={index} className="card hourly-item flex-shrink-0">
                            <div className="card-body p-2 text-center">
                                <p className="mb-1 fw-bold">{convertToStandardTime(hour.startTime)}</p>
                                <img
                                    src={hour.icon}
                                    alt={hour.shortForecast}
                                    className="mb-1"
                                    style={{ width: "60px", height: "60px" }}
                                />
                                <p className="mb-1 h5">
                                    {convertTemperature(hour.temperature, "F", tempUnit)}°{tempUnit}
                                </p>
                                <p className="small text-muted">{hour.shortForecast}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right arrow */}
            <button
                className="btn btn-light ms-2"
                onClick={scrollRight}
                aria-label="Scroll right"
                disabled={!showRightArrow}
            >
                &#9654;
            </button>
        </div>
    );
};

export default HourlyForecast;