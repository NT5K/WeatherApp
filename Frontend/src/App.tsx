// Import necessary dependencies and components
import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { AddressComponents, WeatherResponse } from "./types/types";
import "./App.css";
import Header from "./components/Header";
import AddressForm from "./components/AddressForm";
import WeatherDisplay from "./components/WeatherDisplay";
import ErrorAlert from "./components/ErrorAlert";
import HowToUse from "./components/HowToUse";

// Main App component
const App: React.FC = () => {
  // State for address components
  const [addressComponents, setAddressComponents] = useState<AddressComponents>({
    fromAddress: "",
    city: "",
    state: "",
    zip: "",
  });

  // State for loading indicator, error messages, and weather data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);

  // State for dark mode and temperature unit
  const [darkMode, setDarkMode] = useState(false);
  const [tempUnit, setTempUnit] = useState<"F" | "C">("F");

  // Effect to update theme based on dark mode
  useEffect(() => {
    // Set the theme attribute on the document element
    document.documentElement.setAttribute(
      // Set the theme attribute based on dark mode
      "data-bs-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  // Function to handle input changes in the address form
  // Updates the address components state
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Extract name and value from the input field
    const { name, value } = e.target;
    // Update the address components state
    setAddressComponents((prev) => ({ ...prev, [name]: value }));
  };

  // Function to check if the form is valid
  const isFormValid = useCallback(() => {
    // Check if all address components are filled
    return Object.values(addressComponents).every(
      // Trim the value and check if it's not empty
      (value) => value.trim() !== ""
    );
  }, [addressComponents]);

  // Function to build the address string
  const buildAddress = (): string => {
    // Filter out empty address components and join them with "+"
    return Object.values(addressComponents).filter(Boolean).join("+");
  };

  // Function to fetch weather data
  const fetchData = async () => {
    // Check if the form is valid
    if (!isFormValid()) {
      // Set error message and return
      setError("Please fill in all fields before submitting.");
      return;
    }

    // Reset loading, error, and weather data states
    setLoading(true);
    setError("");
    setWeatherData(null);

    // Try fetching weather data
    try {
      // Build the address string
      const address = buildAddress();
      // Fetch weather data from the API
      const geocodingUrl = `/custom/api/GeoCoding?address=${encodeURIComponent(
        address
      )}`;
      // Get the response data
      const response = await axios.get<WeatherResponse>(geocodingUrl);
      // Set the weather data state
      setWeatherData(response.data);
      // Handle any errors
    } catch (err: any) {
      // Log the error message
      console.error("API Error:", err.message);
      // Set the error message state
      if (err.response && err.response.data && err.response.data.error) {
        // Set the error message state
        setError(`${err.response.data.error}: ${err.response.data.message}`);
        // Set the error message state
      } else {
        // Set the error message state
        setError("An unexpected error occurred. Please try again.");
      }
      // Finally, set loading to false
    } finally {
      // Set loading to false
      setLoading(false);
    }
  };

  // Render the main application structure
  return (
    <div className="weather-app w-full">
      {/* Render the Header component */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        tempUnit={tempUnit}
        setTempUnit={setTempUnit}
      />
      <div className="container-fluid mt-5 pt-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <h1 className="text-center mb-4">Weather Forecast</h1>
            {/* Render the HowToUse component */}
            <HowToUse />
            {/* Render the AddressForm component */}
            <AddressForm
              addressComponents={addressComponents}
              handleInputChange={handleInputChange}
              isFormValid={isFormValid}
              fetchData={fetchData}
              loading={loading}
            />
            {/* Render the ErrorAlert component */}
            <ErrorAlert error={error} />
            {/* Render the WeatherDisplay component */}
            {/* Pass weather data and temperature unit as props */}
            {weatherData && (
              <WeatherDisplay
                weatherData={weatherData}
                tempUnit={tempUnit}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;