import { useState, useEffect } from 'react';

/**
 * Custom hook for browser geolocation
 * @returns {object} - Geolocation state and methods
 */
const useGeolocation = () => {
    const [coords, setCoords] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [permissionDenied, setPermissionDenied] = useState(false);

    useEffect(() => {
        // Check if geolocation is supported
        if (!navigator.geolocation) {
            console.error('Geolocation not supported');
            setError('Geolocation is not supported by your browser');
            setLoading(false);
            return;
        }

        console.log('Requesting geolocation...');
        // Request user location
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log('Geolocation success:', position.coords.latitude, position.coords.longitude);
                setCoords({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                });
                setLoading(false);
                setError(null);
            },
            (err) => {
                console.error('Geolocation error:', err.code, err.message);
                setLoading(false);

                if (err.code === err.PERMISSION_DENIED) {
                    setPermissionDenied(true);
                    setError('Location permission denied. Please search for a city manually.');
                } else if (err.code === err.POSITION_UNAVAILABLE) {
                    setError('Location information is unavailable.');
                } else if (err.code === err.TIMEOUT) {
                    setError('Location request timed out.');
                } else {
                    setError('An unknown error occurred while getting your location.');
                }
            },
            {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 300000, // 5 minutes cache
            }
        );
    }, []);

    /**
     * Retry getting location
     */
    const retry = () => {
        setLoading(true);
        setError(null);
        setPermissionDenied(false);

        console.log('Retrying geolocation...');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log('Geolocation retry success:', position.coords.latitude, position.coords.longitude);
                setCoords({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                });
                setLoading(false);
                setError(null);
            },
            (err) => {
                console.error('Geolocation retry error:', err.code, err.message);
                setLoading(false);

                if (err.code === err.PERMISSION_DENIED) {
                    setPermissionDenied(true);
                    setError('Location permission denied. Please search for a city manually.');
                } else {
                    setError('Failed to get your location. Please try again.');
                }
            }
        );
    };

    return {
        coords,
        loading,
        error,
        permissionDenied,
        retry,
    };
};

export default useGeolocation;
