import React from 'react';
import LocalTime from './LocalTime';

// Define props interface for Header component
interface HeaderProps {
    // Dark mode state
    darkMode: boolean;
    // Function to set dark mode
    setDarkMode: (mode: boolean) => void;
    // Temperature unit state
    tempUnit: "F" | "C";
    // Function to set temperature unit
    setTempUnit: (unit: "F" | "C") => void;
}

// Header component
const Header: React.FC<HeaderProps> = ({ darkMode, setDarkMode, tempUnit, setTempUnit }) => {
    return (
        // Navbar with dark/light mode and temperature unit toggle buttons
        <nav
            className={`navbar navbar-expand-lg fixed-top ${darkMode ? "navbar-dark bg-dark" : "navbar-light bg-light"
                }`}
        >
            <div className="container-fluid">
                {/* App title */}
                <a className="navbar-brand" href="#">
                    Weather App
                </a>
                <div className="ms-auto">
                    {/* LocalTime component */}
                    <LocalTime />
                    {/* Dark mode toggle button */}
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="btn btn-outline-primary me-2"
                    >
                        {darkMode ? "Light" : "Dark"}
                    </button>
                    {/* Temperature unit toggle button */}
                    <button
                        onClick={() => setTempUnit(tempUnit === "F" ? "C" : "F")}
                        className="btn btn-outline-primary"
                    >
                        °{tempUnit === "F" ? "C" : "F"}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Header;