using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Net.Http;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

// Defining the namespace for the controller
namespace WeatherForecastAPI.Controllers
{
    // ForecastPeriod represents a single period in the weather forecast. 
    // It contains properties for various weather attributes like temperature, wind, and precipitation.
    public class ForecastPeriod
    {
        public int Number { get; set; }
        public string? Name { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public bool IsDaytime { get; set; }
        public int Temperature { get; set; }
        public string? TemperatureUnit { get; set; }
        public string? TemperatureTrend { get; set; }
        public ProbabilityOfPrecipitation? ProbabilityOfPrecipitation { get; set; }
        public string? WindSpeed { get; set; }
        public string? WindDirection { get; set; }
        public string? Icon { get; set; }
        public string? ShortForecast { get; set; }
        public string? DetailedForecast { get; set; }
    }

    // ProbabilityOfPrecipitation represents the chance of precipitation. 
    // It includes the unit of measurement and the probability value.
    public class ProbabilityOfPrecipitation
    {
        public string? UnitCode { get; set; }
        public int? Value { get; set; }
    }

    // Marks this class as a controller for Web API.
    [ApiController]
    // Defines the routing pattern for this controller using its name.
    [Route("[controller]")]
    public class GeoCodingController : ControllerBase
    {
        // Private field to store the HTTP client factory
        private readonly IHttpClientFactory _httpClientFactory;

        // Constructor to inject the HTTP client factory
        public GeoCodingController(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        // HTTP GET method to handle geocoding requests
        [HttpGet]
        public async Task<IActionResult> GetGeocodingData([FromQuery] string address)
        {
            try
            {
                // Format the address by replacing spaces with plus signs
                string formattedAddress = address.Replace(" ", "+");

                // Create an HTTP client using the factory
                var client = _httpClientFactory.CreateClient();

                // Step 1: Call geocoding API
                // Make a GET request to the geocoding API with the formatted address
                var geocodingResponse = await client.GetAsync($"https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address={formattedAddress}&benchmark=4&format=json");

                // Check if the geocoding API request was successful
                if (!geocodingResponse.IsSuccessStatusCode)
                {
                    // If not successful, return an error response
                    return StatusCode((int)geocodingResponse.StatusCode, new { error = "Geocoding API error", message = geocodingResponse.ReasonPhrase });
                }

                // Read the content of the geocoding response
                var geocodingContent = await geocodingResponse.Content.ReadAsStringAsync();

                // Deserialize the JSON content into a JObject
                var geocodingResult = JsonConvert.DeserializeObject<JObject>(geocodingContent);

                // Check if deserialization was successful
                if (geocodingResult == null)
                {
                    // If not successful, return a bad request response
                    return BadRequest(new { error = "Geocoding deserialization error", message = "Failed to deserialize geocoding response." });
                }

                // Step 2: Parse coordinates and matched address from geocoding response
                // Extract the address matches from the geocoding result
                var addressMatches = geocodingResult["result"]?["addressMatches"] as JArray;

                // Check if any address matches were found
                if (addressMatches == null || addressMatches.Count == 0)
                {
                    // If no matches found, return a not found response
                    return NotFound(new { error = "Address not found", message = "No address matches found." });
                }

                // Extract coordinates and matched address from the first address match
                var coordinates = addressMatches[0]?["coordinates"];
                var matchedAddress = addressMatches[0]?["matchedAddress"]?.ToString();

                // Check if coordinates and matched address were extracted successfully
                if (coordinates == null || string.IsNullOrEmpty(matchedAddress))
                {
                    // If not successful, return a bad request response
                    return BadRequest(new { error = "Invalid geocoding response", message = "Coordinates or matched address not found in geocoding response." });
                }

                // Extract latitude and longitude as strings
                string? latitudeStr = coordinates["y"]?.ToString();
                string? longitudeStr = coordinates["x"]?.ToString();

                // Check if latitude and longitude strings are valid
                if (string.IsNullOrEmpty(latitudeStr) || string.IsNullOrEmpty(longitudeStr))
                {
                    // If not valid, return a bad request response
                    return BadRequest(new { error = "Invalid coordinates", message = "Invalid coordinates in geocoding response." });
                }

                // Try to parse latitude and longitude strings to double values
                if (!double.TryParse(latitudeStr, out double latitude) || !double.TryParse(longitudeStr, out double longitude))
                {
                    // If parsing fails, return a bad request response
                    return BadRequest(new { error = "Invalid coordinates", message = "Invalid coordinates in geocoding response." });
                }

                // Format latitude and longitude to 4 decimal places
                string formattedLatitude = latitude.ToString("0.####");
                string formattedLongitude = longitude.ToString("0.####");

                // Step 3: Call weather.gov API with formatted coordinates and headers
                // Create a new HTTP request message for the weather API
                var request = new HttpRequestMessage(HttpMethod.Get, $"https://api.weather.gov/points/{formattedLatitude},{formattedLongitude}");

                // Add a User-Agent header to the request. 
                // This identifies your application to the API server and is often required by APIs for tracking and preventing abuse.
                request.Headers.Add("User-Agent", "YourAppName/1.0");

                // Send the weather API request
                var weatherResponse = await client.SendAsync(request);

                // Check if the weather API request was successful
                if (!weatherResponse.IsSuccessStatusCode)
                {
                    // If not successful, return an error response
                    return StatusCode((int)weatherResponse.StatusCode, new { error = "Weather API error", message = weatherResponse.ReasonPhrase });
                }

                // Read the content of the weather response
                var weatherContent = await weatherResponse.Content.ReadAsStringAsync();

                // Deserialize the JSON content into a JObject
                var weatherData = JsonConvert.DeserializeObject<JObject>(weatherContent);

                // Step 4: Extract specific forecast URLs
                // Extract forecast and hourly forecast URLs from the weather data
                var forecastUrl = weatherData?["properties"]?["forecast"]?.ToString();
                var forecastHourlyUrl = weatherData?["properties"]?["forecastHourly"]?.ToString();

                // Check if both forecast URLs were extracted successfully
                if (string.IsNullOrEmpty(forecastUrl) || string.IsNullOrEmpty(forecastHourlyUrl))
                {
                    // If not successful, return a bad request response
                    return BadRequest(new { error = "Invalid weather response", message = "Forecast URLs not found in weather response." });
                }

                // Step 5: Fetch forecast data
                // Fetch regular forecast data using the extracted URL
                var forecastPeriods = await FetchForecastData(client, forecastUrl);

                // Fetch hourly forecast data using the extracted URL
                var hourlyForecastPeriods = await FetchHourlyForecastData(client, forecastHourlyUrl);

                // Step 6: Construct custom response object
                // Create a new object containing all the gathered information
                var customResponse = new
                {
                    Coordinates = new
                    {
                        Latitude = latitude,
                        Longitude = longitude
                    },
                    MatchedAddress = matchedAddress,
                    ForecastPeriods = forecastPeriods,
                    HourlyForecastPeriods = hourlyForecastPeriods
                };

                // Return the custom response object with a 200 OK status
                return Ok(customResponse);
            }
            catch (Exception ex)
            {
                // If any unhandled exception occurs, return a 500 Internal Server Error response
                return StatusCode(500, new { error = "Internal server error", message = ex.Message });
            }
        }

        // Private method to fetch forecast data
        private async Task<List<ForecastPeriod>> FetchForecastData(HttpClient client, string forecastUrl)
        {
            // Create a new HTTP request message for the forecast API. 
            // This allows for more customization of the request compared to using HttpClient.GetAsync() directly.
            var forecastRequest = new HttpRequestMessage(HttpMethod.Get, forecastUrl);

            // Add a User-Agent header to the request. 
            // This identifies your application to the API server and is often required by APIs for tracking and preventing abuse.
            forecastRequest.Headers.Add("User-Agent", "YourAppName/1.0");

            // Send the forecast API request
            var forecastResponse = await client.SendAsync(forecastRequest);

            // Check if the forecast API request was successful
            if (!forecastResponse.IsSuccessStatusCode)
            {
                // If not successful, throw an exception
                throw new HttpRequestException($"Forecast API returned status code: {forecastResponse.StatusCode}");
            }

            // Read the content of the forecast response
            var forecastContent = await forecastResponse.Content.ReadAsStringAsync();

            // Deserialize the JSON content into a JObject
            var forecastData = JsonConvert.DeserializeObject<JObject>(forecastContent);

            // Extract the forecast periods from the forecast data and convert them to a list of ForecastPeriod objects. 
            // This uses null-conditional operators for safe navigation through the JSON structure.
            var periods = forecastData?["properties"]?["periods"]?.ToObject<List<ForecastPeriod>>();

            // Return the list of forecast periods, or an empty list if null
            return periods ?? [];
        }

        // Private method to fetch hourly forecast data
        private async Task<List<ForecastPeriod>> FetchHourlyForecastData(HttpClient client, string forecastHourlyUrl)
        {
            // Create a new HTTP request message for the hourly forecast API
            var forecastRequest = new HttpRequestMessage(HttpMethod.Get, forecastHourlyUrl);

            // Add a User-Agent header to the request. 
            // This identifies your application to the API server and is often required by APIs for tracking and preventing abuse.
            forecastRequest.Headers.Add("User-Agent", "YourAppName/1.0");

            // Send the hourly forecast API request
            var forecastResponse = await client.SendAsync(forecastRequest);

            // Check if the hourly forecast API request was successful
            if (!forecastResponse.IsSuccessStatusCode)
            {
                // If not successful, throw an exception
                throw new HttpRequestException($"Hourly Forecast API returned status code: {forecastResponse.StatusCode}");
            }

            // Read the content of the hourly forecast response
            var forecastContent = await forecastResponse.Content.ReadAsStringAsync();

            // Deserialize the JSON content into a JObject
            var forecastData = JsonConvert.DeserializeObject<JObject>(forecastContent);

            // Extract the hourly forecast periods from the forecast data and convert them to a list of ForecastPeriod objects
            var periods = forecastData?["properties"]?["periods"]?.ToObject<List<ForecastPeriod>>();

            // Return the first 24 hourly forecast periods, or an empty list if null
            return periods?.Take(24).ToList() ?? [];
        }
    }
}