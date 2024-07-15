import React from 'react';

const HowToUse: React.FC = () => {
    return (
        <div className="how-to-use mb-4">
            <h2 className="h5 mb-2">How to Use:</h2>
            <p className="mb-0">
                Enter your full address (street number, city, state, and ZIP code)
                in the fields below and click "Get Forecast" to see your weather prediction.
                Use the toggle buttons in the header to switch between Fahrenheit/Celsius and Light/Dark mode.
                Scroll horizontally to view the hourly forecast. Enjoy!
                
            </p>
        </div>
    );
};

export default HowToUse;