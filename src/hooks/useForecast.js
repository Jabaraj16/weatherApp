import { useState, useCallback } from 'react';
import forecastService from '../services/forecastService';

/**
 * Custom hook for forecast data management
 * @returns {object} - Forecast state and methods
 */
const useForecast = () => {
    const [forecast, setForecast] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Fetch forecast by city
     * @param {string} city - City name
     * @param {number} days - Number of days
     */
    const fetchForecastByCity = useCallback(async (city, days = 5) => {
        setLoading(true);
        setError(null);

        try {
            const data = await forecastService.getForecastByCity(city, days);
            setForecast(data);
            setError(null);
        } catch (err) {
            setError(err.message);
            setForecast(null);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Fetch forecast by coordinates
     * @param {number} lat - Latitude
     * @param {number} lon - Longitude
     * @param {number} days - Number of days
     */
    const fetchForecastByCoords = useCallback(async (lat, lon, days = 5) => {
        setLoading(true);
        setError(null);

        try {
            const data = await forecastService.getForecastByCoords(lat, lon, days);
            setForecast(data);
            setError(null);
        } catch (err) {
            setError(err.message);
            setForecast(null);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Clear forecast data
     */
    const clearForecast = useCallback(() => {
        setForecast(null);
        setError(null);
    }, []);

    return {
        forecast,
        loading,
        error,
        fetchForecastByCity,
        fetchForecastByCoords,
        clearForecast,
    };
};

export default useForecast;
