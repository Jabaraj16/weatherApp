import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { format } from 'date-fns';

/**
 * Get weather emoji
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
 * Hourly Forecast Component
 * @param {object} props - Component props
 * @param {array} props.hours - Array of hourly forecasts
 */
const HourlyForecast = ({ hours }) => {
    const containerRef = useRef(null);
    const cardsRef = useRef([]);

    useEffect(() => {
        if (containerRef.current && cardsRef.current.length > 0) {
            gsap.fromTo(
                containerRef.current,
                { opacity: 0, x: -30 },
                { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out', delay: 0.9 }
            );
        }
    }, [hours]);

    if (!hours || hours.length === 0) return null;

    // Get next 24 hours
    const next24Hours = hours.slice(0, 24);

    return (
        <div className="space-y-4">
            <h2 className="text-white text-2xl font-bold px-4">Hourly Forecast</h2>

            <div
                ref={containerRef}
                className="overflow-x-auto scrollbar-hide px-4"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                }}
            >
                <div className="flex gap-4 pb-2">
                    {next24Hours.map((hour, index) => {
                        const hourTime = new Date(hour.time);
                        const isNow = index === 0;

                        return (
                            <div
                                key={hour.timeEpoch}
                                ref={(el) => (cardsRef.current[index] = el)}
                                className="glass glass-border rounded-xl p-4 min-w-[100px] text-center glass-hover flex-shrink-0"
                            >
                                {/* Time */}
                                <p className="text-white/70 text-sm font-medium mb-2">
                                    {isNow ? 'Now' : format(hourTime, 'h a')}
                                </p>

                                {/* Weather Icon */}
                                <div className="text-3xl mb-2">
                                    {getWeatherEmoji(hour.condition)}
                                </div>

                                {/* Temperature */}
                                <p className="text-white text-xl font-bold mb-2">
                                    {hour.temp_c}°
                                </p>

                                {/* Rain Chance */}
                                {hour.chanceOfRain > 0 && (
                                    <div className="flex items-center justify-center gap-1 text-blue-400 text-xs">
                                        <span>💧</span>
                                        <span>{hour.chanceOfRain}%</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
        </div>
    );
};

export default HourlyForecast;
