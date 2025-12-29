import { useState, useEffect, useCallback, useRef } from 'react';
import weatherService from '../services/weatherService';

const REFRESH_INTERVAL = import.meta.env.VITE_REFRESH_INTERVAL || 300000; // 5 minutes default

/**
 * Custom hook for weather data management
 * @returns {object} - Weather state and methods
 */
const useWeather = () => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const refreshIntervalRef = useRef(null);
    const lastFetchRef = useRef(null);

    /**
     * Fetch weather by coordinates
     * @param {number} lat - Latitude
     * @param {number} lon - Longitude
     */
    const fetchWeatherByCoords = useCallback(async (lat, lon) => {
        setLoading(true);
        setError(null);

        try {
            const data = await weatherService.getWeatherByCoords(lat, lon);
            setWeather(data);
            lastFetchRef.current = { type: 'coords', lat, lon };
            setError(null);
        } catch (err) {
            setError(err.message);
            setWeather(null);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Fetch weather by city name
     * @param {string} city - City name
     */
    const fetchWeatherByCity = useCallback(async (city) => {
        if (!city || !city.trim()) {
            setError('Please enter a city name');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await weatherService.getWeatherByCity(city);
            setWeather(data);
            lastFetchRef.current = { type: 'city', city };
            setError(null);
        } catch (err) {
            setError(err.message);
            setWeather(null);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Refresh current weather data
     */
    const refreshWeather = useCallback(async () => {
        if (!lastFetchRef.current) return;

        const { type, lat, lon, city } = lastFetchRef.current;

        if (type === 'coords') {
            await fetchWeatherByCoords(lat, lon);
        } else if (type === 'city') {
            await fetchWeatherByCity(city);
        }
    }, [fetchWeatherByCoords, fetchWeatherByCity]);

    /**
     * Set up auto-refresh interval
     */
    useEffect(() => {
        if (weather && !refreshIntervalRef.current) {
            refreshIntervalRef.current = setInterval(() => {
                refreshWeather();
            }, REFRESH_INTERVAL);
        }

        return () => {
            if (refreshIntervalRef.current) {
                clearInterval(refreshIntervalRef.current);
                refreshIntervalRef.current = null;
            }
        };
    }, [weather, refreshWeather]);

    /**
     * Clear weather data
     */
    const clearWeather = useCallback(() => {
        setWeather(null);
        setError(null);
        lastFetchRef.current = null;

        if (refreshIntervalRef.current) {
            clearInterval(refreshIntervalRef.current);
            refreshIntervalRef.current = null;
        }
    }, []);

    return {
        weather,
        loading,
        error,
        fetchWeatherByCoords,
        fetchWeatherByCity,
        refreshWeather,
        clearWeather,
    };
};

export default useWeather;
