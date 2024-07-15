
//  Define interface for address components
export interface AddressComponents {
  fromAddress: string;
  city: string;
  state: string;
  zip: string;
}

// Define interface for weather response
export interface WeatherResponse {
  coordinates: {
    latitude: number;
    longitude: number;
  };
  matchedAddress: string;
  forecastPeriods: ForecastPeriod[];
  hourlyForecastPeriods: ForecastPeriod[];
}

// Define interface for forecast period
export interface ForecastPeriod {
  number: number;
  name: string;
  startTime: string;
  endTime: string;
  isDaytime: boolean;
  temperature: number;
  temperatureUnit: string;
  temperatureTrend: string | null;
  probabilityOfPrecipitation: {
    unitCode: string;
    value: number | null;
  };
  windSpeed: string;
  windDirection: string;
  icon: string;
  shortForecast: string;
  detailedForecast: string;
}

// Define interface for consolidated forecast
export interface ConsolidatedForecast {
  day?: ForecastPeriod;
  night?: ForecastPeriod;
}
