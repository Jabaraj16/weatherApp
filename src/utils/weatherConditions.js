/**
 * Utility functions for weather condition mapping
 */

/**
 * Map OpenWeatherMap condition codes to background types
 * @param {string} condition - Weather condition from API (e.g., 'Clear', 'Clouds', 'Rain')
 * @returns {string} - Background type for AnimatedBackground component
 */
export const getBackgroundType = (condition) => {
    const conditionLower = condition?.toLowerCase() || '';

    if (conditionLower.includes('clear') || conditionLower.includes('sun')) {
        return 'sunny';
    }
    if (conditionLower.includes('cloud')) {
        return 'cloudy';
    }
    if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
        return 'rain';
    }
    if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
        return 'thunderstorm';
    }
    if (conditionLower.includes('snow')) {
        return 'snow';
    }
    if (conditionLower.includes('mist') || conditionLower.includes('fog') ||
        conditionLower.includes('haze') || conditionLower.includes('smoke')) {
        return 'fog';
    }

    // Default to cloudy for unknown conditions
    return 'cloudy';
};

/**
 * Get weather icon name based on condition
 * @param {string} condition - Weather condition from API
 * @returns {string} - Material UI icon name
 */
export const getWeatherIcon = (condition) => {
    const conditionLower = condition?.toLowerCase() || '';

    if (conditionLower.includes('clear') || conditionLower.includes('sun')) {
        return 'WbSunny';
    }
    if (conditionLower.includes('cloud')) {
        return 'Cloud';
    }
    if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
        return 'Opacity';
    }
    if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
        return 'FlashOn';
    }
    if (conditionLower.includes('snow')) {
        return 'AcUnit';
    }
    if (conditionLower.includes('mist') || conditionLower.includes('fog') ||
        conditionLower.includes('haze')) {
        return 'Cloud';
    }

    return 'Cloud';
};

/**
 * Get gradient colors for weather condition
 * @param {string} condition - Weather condition
 * @returns {object} - Gradient colors
 */
export const getWeatherGradient = (condition) => {
    const type = getBackgroundType(condition);

    const gradients = {
        sunny: {
            from: '#1e3a8a', // blue-900
            via: '#f59e0b',  // amber-500
            to: '#fbbf24',   // amber-400
        },
        cloudy: {
            from: '#374151', // gray-700
            via: '#6b7280',  // gray-500
            to: '#9ca3af',   // gray-400
        },
        rain: {
            from: '#1e293b', // slate-800
            via: '#334155',  // slate-700
            to: '#475569',   // slate-600
        },
        thunderstorm: {
            from: '#1f2937', // gray-800
            via: '#4c1d95',  // purple-900
            to: '#5b21b6',   // purple-800
        },
        snow: {
            from: '#dbeafe', // blue-100
            via: '#bfdbfe',  // blue-200
            to: '#93c5fd',   // blue-300
        },
        fog: {
            from: '#4b5563', // gray-600
            via: '#6b7280',  // gray-500
            to: '#9ca3af',   // gray-400
        },
    };

    return gradients[type] || gradients.cloudy;
};
