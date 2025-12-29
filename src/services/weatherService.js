import axios from 'axios';

const API_KEY = import.meta.env.VITE_WEATHERAPI_KEY;
const BASE_URL = 'https://api.weatherapi.com/v1';

/**
 * Weather Service for WeatherAPI.com
 */
class WeatherService {
    /**
     * Fetch weather data by coordinates
     * @param {number} lat - Latitude
     * @param {number} lon - Longitude
     * @returns {Promise<object>} - Weather data
     */
    async getWeatherByCoords(lat, lon) {
        try {
            const response = await axios.get(`${BASE_URL}/current.json`, {
                params: {
                    key: API_KEY,
                    q: `${lat},${lon}`,
                    aqi: 'no',
                },
            });

            return this.transformWeatherData(response.data);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Fetch weather data by city name
     * @param {string} city - City name
     * @returns {Promise<object>} - Weather data
     */
    async getWeatherByCity(city) {
        try {
            const response = await axios.get(`${BASE_URL}/current.json`, {
                params: {
                    key: API_KEY,
                    q: city,
                    aqi: 'no',
                },
            });

            return this.transformWeatherData(response.data);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Transform raw API data to app format
     * @param {object} data - Raw API response
     * @returns {object} - Transformed weather data
     */
    transformWeatherData(data) {
        const location = data.location;
        const current = data.current;

        // WeatherAPI provides astronomy data, but we'll use approximate times for consistency
        const now = new Date();
        const sunrise = new Date(now);
        sunrise.setHours(6, 0, 0, 0);

        const sunset = new Date(now);
        sunset.setHours(18, 0, 0, 0);

        return {
            city: location.name,
            country: location.country,
            temperature: Math.round(current.temp_c),
            feelsLike: Math.round(current.feelslike_c),
            condition: this.mapWeatherCondition(current.condition.text),
            description: current.condition.text.toLowerCase(),
            humidity: current.humidity,
            windSpeed: Math.round(current.wind_kph / 3.6 * 10) / 10, // Convert km/h to m/s, round to 1 decimal
            sunrise: Math.floor(sunrise.getTime() / 1000),
            sunset: Math.floor(sunset.getTime() / 1000),
            timezone: location.tz_id ? this.getTimezoneOffset(location.localtime) : 0,
            timestamp: Math.floor(new Date(location.localtime).getTime() / 1000),
            coords: {
                lat: location.lat,
                lon: location.lon,
            },
        };
    }

    /**
     * Get timezone offset from localtime
     * @param {string} localtime - Local time string
     * @returns {number} - Timezone offset in seconds
     */
    getTimezoneOffset(localtime) {
        const local = new Date(localtime);
        const utc = new Date(local.toUTCString());
        return Math.floor((local - utc) / 1000);
    }

    /**
     * Map WeatherAPI condition text to standard conditions
     * @param {string} conditionText - Weather condition from API
     * @returns {string} - Standardized condition
     */
    mapWeatherCondition(conditionText) {
        const text = conditionText.toLowerCase();

        if (text.includes('sunny') || text.includes('clear')) {
            return 'Clear';
        }
        if (text.includes('cloud') || text.includes('overcast')) {
            return 'Clouds';
        }
        if (text.includes('rain') || text.includes('drizzle') || text.includes('shower')) {
            return 'Rain';
        }
        if (text.includes('thunder') || text.includes('storm')) {
            return 'Thunderstorm';
        }
        if (text.includes('snow') || text.includes('sleet') || text.includes('blizzard')) {
            return 'Snow';
        }
        if (text.includes('mist') || text.includes('fog') || text.includes('haze')) {
            return 'Mist';
        }

        return 'Clouds'; // Default
    }

    /**
     * Handle API errors
     * @param {Error} error - Error object
     * @returns {Error} - Formatted error
     */
    handleError(error) {
        if (error.response) {
            // API responded with error
            const status = error.response.status;
            const data = error.response.data;

            if (status === 400) {
                if (data.error && data.error.message) {
                    return new Error(data.error.message);
                }
                return new Error('Invalid request. Please check the city name and try again.');
            }
            if (status === 401 || status === 403) {
                return new Error('Invalid API key. Please check your configuration.');
            }
            if (status === 429) {
                return new Error('API rate limit exceeded. Please try again later.');
            }

            return new Error('Failed to fetch weather data. Please try again.');
        } else if (error.request) {
            // Request made but no response
            return new Error('No response from server. Please check your internet connection.');
        } else {
            // Something else happened
            return new Error('An unexpected error occurred. Please try again.');
        }
    }
}

export default new WeatherService();
