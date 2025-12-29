import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import { formatTime } from '../utils/dateUtils';

/**
 * Sunrise and Sunset Component
 * @param {object} props - Component props
 * @param {object} props.weather - Weather data
 */
const SunriseSunset = ({ weather }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current) {
            gsap.fromTo(
                containerRef.current,
                {
                    opacity: 0,
                    y: 30,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: 'power3.out',
                    delay: 0.9,
                }
            );
        }
    }, [weather]);

    if (!weather) return null;

    return (
        <div
            ref={containerRef}
            className="glass glass-border rounded-2xl p-6 md:p-8 glass-hover"
        >
            <div className="flex flex-col sm:flex-row justify-around items-center gap-6 sm:gap-8">
                {/* Sunrise */}
                <div className="flex flex-col items-center space-y-3">
                    <div className="glass-dark rounded-full p-4">
                        <WbSunnyIcon
                            className="text-yellow-400"
                            sx={{ fontSize: 48 }}
                        />
                    </div>
                    <div className="text-center">
                        <p className="text-white/60 text-sm font-medium mb-1">Sunrise</p>
                        <p className="text-white text-xl md:text-2xl font-bold">
                            {formatTime(weather.sunrise, weather.timezone)}
                        </p>
                    </div>
                </div>

                {/* Divider */}
                <div className="hidden sm:block w-px h-24 bg-white/20"></div>
                <div className="sm:hidden w-24 h-px bg-white/20"></div>

                {/* Sunset */}
                <div className="flex flex-col items-center space-y-3">
                    <div className="glass-dark rounded-full p-4">
                        <NightsStayIcon
                            className="text-indigo-400"
                            sx={{ fontSize: 48 }}
                        />
                    </div>
                    <div className="text-center">
                        <p className="text-white/60 text-sm font-medium mb-1">Sunset</p>
                        <p className="text-white text-xl md:text-2xl font-bold">
                            {formatTime(weather.sunset, weather.timezone)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SunriseSunset;
