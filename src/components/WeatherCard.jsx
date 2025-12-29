import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CloudIcon from '@mui/icons-material/Cloud';
import OpacityIcon from '@mui/icons-material/Opacity';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { getWeatherIcon } from '../utils/weatherConditions';
import { formatDateTime } from '../utils/dateUtils';

// Icon mapping
const iconComponents = {
    WbSunny: WbSunnyIcon,
    Cloud: CloudIcon,
    Opacity: OpacityIcon,
    FlashOn: FlashOnIcon,
    AcUnit: AcUnitIcon,
};

/**
 * Main Weather Card Component
 * @param {object} props - Component props
 * @param {object} props.weather - Weather data
 */
const WeatherCard = ({ weather }) => {
    const cardRef = useRef(null);
    const tempRef = useRef(null);

    useEffect(() => {
        if (cardRef.current) {
            // Card entrance animation
            gsap.fromTo(
                cardRef.current,
                {
                    opacity: 0,
                    y: 50,
                    scale: 0.95,
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.8,
                    ease: 'power3.out',
                }
            );
        }
    }, []);

    useEffect(() => {
        if (tempRef.current && weather) {
            // Temperature count-up animation
            gsap.fromTo(
                tempRef.current,
                {
                    textContent: 0,
                },
                {
                    textContent: weather.temperature,
                    duration: 1.5,
                    ease: 'power2.out',
                    snap: { textContent: 1 },
                    onUpdate: function () {
                        tempRef.current.textContent = Math.round(this.targets()[0].textContent);
                    },
                }
            );
        }
    }, [weather]);

    if (!weather) return null;

    const IconComponent = iconComponents[getWeatherIcon(weather.condition)] || CloudIcon;

    return (
        <div
            ref={cardRef}
            className="glass glass-border rounded-3xl p-8 md:p-12 text-center space-y-6 glass-hover"
        >
            {/* Weather Icon */}
            <div className="flex justify-center">
                <div className="glass-dark rounded-full p-6 glass-glow">
                    <IconComponent
                        className="text-white"
                        sx={{ fontSize: 80 }}
                    />
                </div>
            </div>

            {/* Temperature */}
            <div className="space-y-2">
                <div className="flex items-start justify-center">
                    <span
                        ref={tempRef}
                        className="text-7xl md:text-8xl font-bold text-white"
                    >
                        {weather.temperature}
                    </span>
                    <span className="text-4xl md:text-5xl font-light text-white/80 mt-2">
                        °C
                    </span>
                </div>

                {/* Weather Condition */}
                <p className="text-2xl md:text-3xl font-medium text-white/90 capitalize">
                    {weather.description}
                </p>
            </div>

            {/* Location */}
            <div className="flex items-center justify-center gap-2 text-white/70">
                <LocationOnIcon />
                <span className="text-lg md:text-xl font-medium">
                    {weather.city}, {weather.country}
                </span>
            </div>

            {/* Date and Time */}
            <p className="text-white/60 text-sm md:text-base">
                {formatDateTime(weather.timestamp, weather.timezone)}
            </p>
        </div>
    );
};

export default WeatherCard;
