import axios from 'axios';

const API_KEY = import.meta.env.VITE_WEATHERSTACK_API_KEY;
const BASE_URL = 'http://api.weatherstack.com';

/**
 * Weather Service for WeatherStack API
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
            const response = await axios.get(`${BASE_URL}/current`, {
                params: {
                    access_key: API_KEY,
                    query: `${lat},${lon}`,
                    units: 'm', // Metric units (Celsius)
                },
            });

            if (response.data.error) {
                throw new Error(response.data.error.info || 'Failed to fetch weather data');
            }

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
            const response = await axios.get(`${BASE_URL}/current`, {
                params: {
                    access_key: API_KEY,
                    query: city,
                    units: 'm', // Metric units (Celsius)
                },
            });

            if (response.data.error) {
                throw new Error(response.data.error.info || 'Failed to fetch weather data');
            }

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

        // Calculate sunrise/sunset (WeatherStack doesn't provide this, using approximate times)
        const now = new Date();
        const sunrise = new Date(now);
        sunrise.setHours(6, 0, 0, 0);

        const sunset = new Date(now);
        sunset.setHours(18, 0, 0, 0);

        return {
            city: location.name,
            country: location.country,
            temperature: Math.round(current.temperature),
            feelsLike: Math.round(current.feelslike),
            condition: this.mapWeatherDescription(current.weather_descriptions[0]),
            description: current.weather_descriptions[0].toLowerCase(),
            humidity: current.humidity,
            windSpeed: Math.round(current.wind_speed / 3.6 * 10) / 10, // Convert km/h to m/s, round to 1 decimal
            sunrise: Math.floor(sunrise.getTime() / 1000),
            sunset: Math.floor(sunset.getTime() / 1000),
            timezone: location.utc_offset * 3600, // Convert hours to seconds
            timestamp: Math.floor(new Date(location.localtime).getTime() / 1000),
            coords: {
                lat: parseFloat(location.lat),
                lon: parseFloat(location.lon),
            },
        };
    }

    /**
     * Map WeatherStack weather descriptions to standard conditions
     * @param {string} description - Weather description from API
     * @returns {string} - Standardized condition
     */
    mapWeatherDescription(description) {
        const desc = description.toLowerCase();

        if (desc.includes('sunny') || desc.includes('clear')) {
            return 'Clear';
        }
        if (desc.includes('cloud') || desc.includes('overcast')) {
            return 'Clouds';
        }
        if (desc.includes('rain') || desc.includes('drizzle')) {
            return 'Rain';
        }
        if (desc.includes('thunder') || desc.includes('storm')) {
            return 'Thunderstorm';
        }
        if (desc.includes('snow') || desc.includes('sleet')) {
            return 'Snow';
        }
        if (desc.includes('mist') || desc.includes('fog') || desc.includes('haze')) {
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
        if (error.message && !error.response) {
            // Error from API response
            return new Error(error.message);
        }

        if (error.response) {
            // API responded with error
            const status = error.response.status;

            if (status === 404) {
                return new Error('Location not found. Please check the spelling and try again.');
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
