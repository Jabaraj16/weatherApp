import axios from 'axios';

const API_KEY = import.meta.env.VITE_WEATHERAPI_KEY;
const BASE_URL = 'https://api.weatherapi.com/v1';

/**
 * Forecast Service for WeatherAPI.com
 */
class ForecastService {
    /**
     * Fetch 5-day forecast by city
     * @param {string} city - City name
     * @param {number} days - Number of days (default: 5)
     * @returns {Promise<object>} - Forecast data
     */
    async getForecastByCity(city, days = 5) {
        try {
            const response = await axios.get(`${BASE_URL}/forecast.json`, {
                params: {
                    key: API_KEY,
                    q: city,
                    days: days,
                    aqi: 'yes',
                    alerts: 'yes',
                },
            });

            return this.transformForecastData(response.data);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Fetch forecast by coordinates
     * @param {number} lat - Latitude
     * @param {number} lon - Longitude
     * @param {number} days - Number of days
     * @returns {Promise<object>} - Forecast data
     */
    async getForecastByCoords(lat, lon, days = 5) {
        try {
            const response = await axios.get(`${BASE_URL}/forecast.json`, {
                params: {
                    key: API_KEY,
                    q: `${lat},${lon}`,
                    days: days,
                    aqi: 'yes',
                    alerts: 'yes',
                },
            });

            return this.transformForecastData(response.data);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Transform forecast data to app format
     * @param {object} data - Raw API response
     * @returns {object} - Transformed data
     */
    transformForecastData(data) {
        const location = data.location;
        const current = data.current;
        const forecast = data.forecast.forecastday;
        const alerts = data.alerts?.alert || [];

        return {
            location: {
                name: location.name,
                country: location.country,
                lat: location.lat,
                lon: location.lon,
                localtime: location.localtime,
            },
            current: {
                temp_c: Math.round(current.temp_c),
                condition: current.condition.text,
                humidity: current.humidity,
                wind_kph: current.wind_kph,
                feelslike_c: Math.round(current.feelslike_c),
            },
            forecast: forecast.map((day) => ({
                date: day.date,
                dateEpoch: day.date_epoch,
                day: {
                    maxtemp_c: Math.round(day.day.maxtemp_c),
                    mintemp_c: Math.round(day.day.mintemp_c),
                    avgtemp_c: Math.round(day.day.avgtemp_c),
                    condition: day.day.condition.text,
                    conditionIcon: day.day.condition.icon,
                    chanceOfRain: day.day.daily_chance_of_rain,
                    chanceOfSnow: day.day.daily_chance_of_snow,
                    maxwind_kph: day.day.maxwind_kph,
                    avghumidity: day.day.avghumidity,
                },
                astro: {
                    sunrise: day.astro.sunrise,
                    sunset: day.astro.sunset,
                    moonrise: day.astro.moonrise,
                    moonset: day.astro.moonset,
                    moon_phase: day.astro.moon_phase,
                },
                hour: day.hour.map((h) => ({
                    time: h.time,
                    timeEpoch: h.time_epoch,
                    temp_c: Math.round(h.temp_c),
                    condition: h.condition.text,
                    conditionIcon: h.condition.icon,
                    chanceOfRain: h.chance_of_rain,
                    chanceOfSnow: h.chance_of_snow,
                    wind_kph: h.wind_kph,
                    humidity: h.humidity,
                })),
            })),
            airQuality: current.air_quality
                ? {
                    pm2_5: current.air_quality.pm2_5,
                    pm10: current.air_quality.pm10,
                    co: current.air_quality.co,
                    no2: current.air_quality.no2,
                    so2: current.air_quality.so2,
                    o3: current.air_quality.o3,
                    usEpaIndex: current.air_quality['us-epa-index'],
                    gbDefraIndex: current.air_quality['gb-defra-index'],
                }
                : null,
            alerts: alerts.map((alert) => ({
                headline: alert.headline,
                severity: alert.severity,
                urgency: alert.urgency,
                areas: alert.areas,
                category: alert.category,
                certainty: alert.certainty,
                event: alert.event,
                note: alert.note,
                effective: alert.effective,
                expires: alert.expires,
                desc: alert.desc,
                instruction: alert.instruction,
            })),
        };
    }

    /**
     * Handle API errors
     * @param {Error} error - Error object
     * @returns {Error} - Formatted error
     */
    handleError(error) {
        if (error.response) {
            const status = error.response.status;
            const data = error.response.data;

            if (status === 400 && data.error) {
                return new Error(data.error.message);
            }
            if (status === 401 || status === 403) {
                return new Error('Invalid API key. Please check your configuration.');
            }
            if (status === 429) {
                return new Error('API rate limit exceeded. Please try again later.');
            }

            return new Error('Failed to fetch forecast data. Please try again.');
        } else if (error.request) {
            return new Error('No response from server. Please check your internet connection.');
        } else {
            return new Error('An unexpected error occurred. Please try again.');
        }
    }
}

export default new ForecastService();
