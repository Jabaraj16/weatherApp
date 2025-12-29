import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { format, fromUnixTime } from 'date-fns';

/**
 * Map condition to weather icon emoji
 */
const getWeatherEmoji = (condition) => {
    const cond = condition.toLowerCase();
    if (cond.includes('sunny') || cond.includes('clear')) return '☀️';
    if (cond.includes('cloud')) return '☁️';
    if (cond.includes('rain')) return '🌧️';
    if (cond.includes('thunder')) return '⛈️';
    if (cond.includes('snow')) return '❄️';
    if (cond.includes('fog') || cond.includes('mist')) return '🌫️';
    return '🌤️';
};

/**
 * 5-Day Forecast Component
 * @param {object} props - Component props
 * @param {array} props.forecast - Array of forecast days
 */
const FiveDayForecast = ({ forecast }) => {
    const cardsRef = useRef([]);

    useEffect(() => {
        if (cardsRef.current.length > 0) {
            gsap.fromTo(
                cardsRef.current,
                { opacity: 0, y: 30, scale: 0.95 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: 'power3.out',
                    delay: 0.6,
                }
            );
        }
    }, [forecast]);

    if (!forecast || forecast.length === 0) return null;

    return (
        <div className="space-y-4">
            <h2 className="text-white text-2xl font-bold px-4">5-Day Forecast</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 px-4">
                {forecast.map((day, index) => (
                    <div
                        key={day.dateEpoch}
                        ref={(el) => (cardsRef.current[index] = el)}
                        className="glass glass-border rounded-2xl p-4 glass-hover text-center"
                    >
                        {/* Day Name */}
                        <p className="text-white/70 text-sm font-medium mb-2">
                            {index === 0 ? 'Today' : format(fromUnixTime(day.dateEpoch), 'EEE')}
                        </p>

                        {/* Weather Icon */}
                        <div className="text-5xl mb-3">
                            {getWeatherEmoji(day.day.condition)}
                        </div>

                        {/* Temperature */}
                        <div className="mb-3">
                            <p className="text-white text-2xl font-bold">
                                {day.day.maxtemp_c}°
                            </p>
                            <p className="text-white/60 text-sm">
                                {day.day.mintemp_c}°
                            </p>
                        </div>

                        {/* Condition */}
                        <p className="text-white/80 text-sm mb-3 capitalize">
                            {day.day.condition}
                        </p>

                        {/* Rain Chance */}
                        {day.day.chanceOfRain > 0 && (
                            <div className="flex items-center justify-center gap-1 text-blue-400 text-xs">
                                <span>💧</span>
                                <span>{day.day.chanceOfRain}%</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FiveDayForecast;
