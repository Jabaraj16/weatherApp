import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { format } from 'date-fns';

/**
 * Get AQI level and color
 * @param {number} index - US EPA AQI index (1-6)
 * @returns {object} - Level info
 */
const getAQIInfo = (index) => {
    const levels = {
        1: { level: 'Good', color: 'text-green-400', bgColor: 'bg-green-500/20', description: 'Air quality is satisfactory' },
        2: { level: 'Moderate', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20', description: 'Acceptable for most people' },
        3: { level: 'Unhealthy for Sensitive', color: 'text-orange-400', bgColor: 'bg-orange-500/20', description: 'Sensitive groups may experience effects' },
        4: { level: 'Unhealthy', color: 'text-red-400', bgColor: 'bg-red-500/20', description: 'Everyone may experience effects' },
        5: { level: 'Very Unhealthy', color: 'text-purple-400', bgColor: 'bg-purple-500/20', description: 'Health alert: everyone may experience serious effects' },
        6: { level: 'Hazardous', color: 'text-pink-400', bgColor: 'bg-pink-500/20', description: 'Health warning of emergency conditions' },
    };
    return levels[index] || levels[1];
};

/**
 * Air Quality Card Component
 * @param {object} props - Component props
 * @param {object} props.airQuality - Air quality data
 */
const AirQualityCard = ({ airQuality }) => {
    const cardRef = useRef(null);

    useEffect(() => {
        if (cardRef.current) {
            gsap.fromTo(
                cardRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 1.2 }
            );
        }
    }, [airQuality]);

    if (!airQuality) return null;

    const aqiInfo = getAQIInfo(airQuality.usEpaIndex);

    return (
        <div ref={cardRef} className="glass glass-border rounded-2xl p-6 glass-hover">
            <h3 className="text-white text-xl font-semibold mb-4">Air Quality</h3>

            {/* AQI Level */}
            <div className={`${aqiInfo.bgColor} rounded-xl p-4 mb-4`}>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-white/70 text-sm">AQI Level</span>
                    <span className={`${aqiInfo.color} text-2xl font-bold`}>
                        {airQuality.usEpaIndex}
                    </span>
                </div>
                <p className={`${aqiInfo.color} font-semibold text-lg mb-1`}>
                    {aqiInfo.level}
                </p>
                <p className="text-white/60 text-sm">{aqiInfo.description}</p>
            </div>

            {/* Pollutants */}
            <div className="grid grid-cols-2 gap-3">
                <div className="glass-dark rounded-lg p-3">
                    <p className="text-white/60 text-xs mb-1">PM2.5</p>
                    <p className="text-white text-lg font-semibold">
                        {airQuality.pm2_5?.toFixed(1)} <span className="text-sm">μg/m³</span>
                    </p>
                </div>
                <div className="glass-dark rounded-lg p-3">
                    <p className="text-white/60 text-xs mb-1">PM10</p>
                    <p className="text-white text-lg font-semibold">
                        {airQuality.pm10?.toFixed(1)} <span className="text-sm">μg/m³</span>
                    </p>
                </div>
                <div className="glass-dark rounded-lg p-3">
                    <p className="text-white/60 text-xs mb-1">O₃</p>
                    <p className="text-white text-lg font-semibold">
                        {airQuality.o3?.toFixed(1)} <span className="text-sm">μg/m³</span>
                    </p>
                </div>
                <div className="glass-dark rounded-lg p-3">
                    <p className="text-white/60 text-xs mb-1">NO₂</p>
                    <p className="text-white text-lg font-semibold">
                        {airQuality.no2?.toFixed(1)} <span className="text-sm">μg/m³</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AirQualityCard;
