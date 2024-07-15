# Weather Forecast Application

## Overview

This Weather Forecast Application is a full-stack project that combines a .NET Core backend with a React TypeScript frontend. It provides users with detailed weather forecasts based on their location input.

The project includes a `sample-api-response.json` file, which demonstrates the structure of the API response object. This file is useful for understanding the data format and for mock testing purposes.

Sample test endpoint(Postman): `http://localhost:5132/geocoding?address=3333+Richmond+Rd+Beachwood+OH+44122`

Once the backend is running, take note of the port number in the terminal, if it is not listening on localhost 5132, which is what is set in the react app, change the port number in the front end in the `vite.config.ts` file to the one that the backend is running at.

## Key Features

- Address-based weather forecasting
- 24-hour hourly forecast
- 7-day daily forecast
- Temperature unit conversion (Fahrenheit/Celsius)
- Dark mode support

## Technologies Used

### Backend

- .NET 8.0
- ASP.NET Core Web API
- HttpClient for API requests
- Newtonsoft.Json for JSON parsing

### Frontend

- React 18
- TypeScript
- Vite (for fast development and building)
- Axios for API requests
- Bootstrap for styling

## The Importance of Interfaces

This project heavily utilizes TypeScript interfaces, which are crucial for several reasons:

1. **Type Safety**: Interfaces ensure that objects adhere to a specific structure, catching type-related errors at compile-time.
2. **Code Documentation**: They serve as self-documenting code, clearly defining the shape of data structures.
3. **Enhanced IDE Support**: Interfaces enable better autocomplete and IntelliSense features in IDEs.
4. **Scalability**: As the project grows, interfaces make it easier to maintain and refactor code.

Key interfaces in this project include `AddressComponents`, `WeatherResponse`, and `ForecastPeriod`, which define the structure of data passed between components and API responses. The `AddressComponents` interface is used in the `AddressForm` component to ensure type-safe handling of user input. When the form is submitted, this data is sent to the backend's `GeoCodingController`, which processes it and makes external API calls. The controller then constructs a `WeatherResponse` object, which includes an array of `ForecastPeriod` objects, representing both hourly and daily forecasts. This `WeatherResponse` is sent back to the frontend, where it's consumed by the `WeatherDisplay` component and its children (`HourlyForecast` and `DailyForecast`). By using these interfaces consistently across the frontend and backend, we ensure that data is correctly structured and typed at every step of the process, from user input to API response handling and UI rendering.

## Getting Started

### Prerequisites

- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Backend Setup

1. Clone the repository:

   ```
   git clone https://github.com/NT5K/WeatherApp.git
   cd WeatherApp
   ```

2. Navigate to the backend directory:

   ```
   cd Backend
   ```

3. Restore the required packages:

   ```
   dotnet restore
   ```

4. Run the backend:
   ```
   dotnet run
   ```

The API will start running, typically on `https://localhost:5001` and `http://localhost:5000`.

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:

   ```
   cd Frontend
   ```

2. Install dependencies:

   ```
   npm install
   ```

   or if you're using yarn:

   ```
   yarn
   ```
   
3. Make sure the localhost port in the ``vite.config.ts` file is the same as the the one running the backend server (check on backend terminal).

4. Start the development server:
   ```
   npm run dev
   ```
   or with yarn:
   ```
   yarn dev
   ```

The frontend will start, usually on `http://localhost:5173`.

## Running the Complete Application

1. Start the backend server as described in the Backend Setup.
2. In a new terminal, start the frontend development server as described in the Frontend Setup.
3. Open your browser and navigate to `http://localhost:5173` (or the port Vite is using).

## Main Components

### Backend Components

1. **GeoCodingController**:

   - Handles the main API endpoint for weather forecasts.
   - Processes address input and coordinates geocoding requests.
   - Fetches weather data from external APIs.
   - Consolidates and returns formatted weather forecast data.

2. **ForecastPeriod and ProbabilityOfPrecipitation Classes**:

   - Define the structure for forecast data and precipitation probability.
   - Used for serialization and deserialization of API responses.

3. **HttpClient Usage**:

   - Manages HTTP requests to external APIs for geocoding and weather data.

4. **Error Handling and Logging**:
   - Implements robust error handling for API requests and data processing.
   - Logs errors and important events for debugging and monitoring.

### Frontend Components

1. **App Component**:

   - The main container component that manages the overall state and layout.
   - Handles dark mode toggle and temperature unit conversion.

2. **Header Component**:

   - Displays the application title, local time, and contains theme/unit toggles.

3. **AddressForm Component**:

   - Manages the input form for user address entry.
   - Validates input and triggers weather data fetching.

4. **WeatherDisplay Component**:

   - Renders the fetched weather data.
   - Contains HourlyForecast and DailyForecast components.

5. **HourlyForecast Component**:

   - Displays a scrollable 24-hour forecast with 6 visible cards at a time.
   - Implements custom scrolling behavior with navigation arrows.

6. **DailyForecast Component**:

   - Shows the 7-day forecast using ForecastCard components.

7. **ForecastCard Component**:

   - Renders individual forecast cards for both hourly and daily forecasts.

8. **ErrorAlert Component**:

   - Displays error messages when API requests or data processing fails.

9. **Types and Interfaces**:
   - Defines TypeScript interfaces for API responses and component props.
   - Ensures type safety across the application.

## API Endpoints

- GET `/api/GeoCoding?address={address}`: Fetches weather forecast data for the specified address.

## Sample API Response

The `sample-api-response.json` file in the project root provides an example of the API response structure. This file is useful for:

- Understanding the data format returned by the API
- Mocking API responses during frontend development and testing
- Verifying that the frontend correctly handles the expected data structure

