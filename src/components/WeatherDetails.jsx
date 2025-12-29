import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AirIcon from '@mui/icons-material/Air';
import DescriptionIcon from '@mui/icons-material/Description';

/**
 * Weather Details Component - Grid of glass cards
 * @param {object} props - Component props
 * @param {object} props.weather - Weather data
 */
const WeatherDetails = ({ weather }) => {
    const cardsRef = useRef([]);

    useEffect(() => {
        if (cardsRef.current.length > 0) {
            // Stagger animation for detail cards
            gsap.fromTo(
                cardsRef.current,
                {
                    opacity: 0,
                    y: 30,
                    scale: 0.95,
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.6,
                    stagger: 0.15,
                    ease: 'power3.out',
                    delay: 0.3,
                }
            );
        }
    }, [weather]);

    if (!weather) return null;

    const details = [
        {
            icon: ThermostatIcon,
            label: 'Feels Like',
            value: `${weather.feelsLike}°C`,
            color: 'text-orange-400',
        },
        {
            icon: WaterDropIcon,
            label: 'Humidity',
            value: `${weather.humidity}%`,
            color: 'text-blue-400',
        },
        {
            icon: AirIcon,
            label: 'Wind Speed',
            value: `${weather.windSpeed} m/s`,
            color: 'text-cyan-400',
        },
        {
            icon: DescriptionIcon,
            label: 'Condition',
            value: weather.condition,
            color: 'text-purple-400',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {details.map((detail, index) => {
                const IconComponent = detail.icon;

                return (
                    <div
                        key={detail.label}
                        ref={(el) => (cardsRef.current[index] = el)}
                        className="glass glass-border rounded-2xl p-6 space-y-3 glass-hover"
                    >
                        {/* Icon */}
                        <div className={`${detail.color}`}>
                            <IconComponent sx={{ fontSize: 40 }} />
                        </div>

                        {/* Value */}
                        <p className="text-2xl md:text-3xl font-bold text-white">
                            {detail.value}
                        </p>

                        {/* Label */}
                        <p className="text-sm md:text-base text-white/60 font-medium">
                            {detail.label}
                        </p>
                    </div>
                );
            })}
        </div>
    );
};

export default WeatherDetails;
