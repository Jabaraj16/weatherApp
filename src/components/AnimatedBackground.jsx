import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { getBackgroundType } from '../utils/weatherConditions';

/**
 * Animated Background Component
 * Changes based on weather condition with smooth GSAP transitions
 * @param {object} props - Component props
 * @param {string} props.condition - Weather condition
 */
const AnimatedBackground = ({ condition }) => {
    const backgroundType = getBackgroundType(condition);
    const containerRef = useRef(null);
    const particlesRef = useRef([]);
    const timelineRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Clear previous timeline
        if (timelineRef.current) {
            timelineRef.current.kill();
        }

        // Create new timeline based on weather type
        timelineRef.current = gsap.timeline();

        switch (backgroundType) {
            case 'sunny':
                animateSunny();
                break;
            case 'cloudy':
                animateCloudy();
                break;
            case 'rain':
                animateRain();
                break;
            case 'thunderstorm':
                animateThunderstorm();
                break;
            case 'snow':
                animateSnow();
                break;
            case 'fog':
                animateFog();
                break;
            default:
                animateCloudy();
        }

        return () => {
            if (timelineRef.current) {
                timelineRef.current.kill();
            }
        };
    }, [backgroundType]);

    // Sunny animation - rotating sun rays
    const animateSunny = () => {
        const particles = particlesRef.current;

        particles.forEach((particle, i) => {
            gsap.to(particle, {
                rotation: 360,
                duration: 20 + i * 2,
                repeat: -1,
                ease: 'none',
            });

            gsap.to(particle, {
                opacity: 0.3 + Math.random() * 0.4,
                duration: 2 + Math.random() * 2,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
            });
        });
    };

    // Cloudy animation - slow moving clouds
    const animateCloudy = () => {
        const particles = particlesRef.current;

        particles.forEach((particle, i) => {
            gsap.fromTo(
                particle,
                {
                    x: -200,
                },
                {
                    x: window.innerWidth + 200,
                    duration: 30 + i * 5,
                    repeat: -1,
                    ease: 'none',
                    delay: i * 3,
                }
            );
        });
    };

    // Rain animation - falling raindrops
    const animateRain = () => {
        const particles = particlesRef.current;

        particles.forEach((particle, i) => {
            const startY = -50 - Math.random() * 100;
            const endY = window.innerHeight + 50;

            gsap.fromTo(
                particle,
                {
                    y: startY,
                    x: Math.random() * window.innerWidth,
                },
                {
                    y: endY,
                    duration: 1 + Math.random() * 0.5,
                    repeat: -1,
                    ease: 'none',
                    delay: Math.random() * 2,
                }
            );
        });
    };

    // Thunderstorm animation - lightning flashes + rain
    const animateThunderstorm = () => {
        const particles = particlesRef.current;

        // Rain particles
        particles.slice(0, 40).forEach((particle, i) => {
            const startY = -50 - Math.random() * 100;
            const endY = window.innerHeight + 50;

            gsap.fromTo(
                particle,
                {
                    y: startY,
                    x: Math.random() * window.innerWidth,
                },
                {
                    y: endY,
                    duration: 0.8 + Math.random() * 0.4,
                    repeat: -1,
                    ease: 'none',
                    delay: Math.random() * 2,
                }
            );
        });

        // Lightning flashes
        const lightning = () => {
            gsap.to(containerRef.current, {
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                onComplete: () => {
                    gsap.delayedCall(3 + Math.random() * 5, lightning);
                },
            });
        };

        gsap.delayedCall(2, lightning);
    };

    // Snow animation - floating snowflakes
    const animateSnow = () => {
        const particles = particlesRef.current;

        particles.forEach((particle, i) => {
            const startY = -50 - Math.random() * 100;
            const endY = window.innerHeight + 50;
            const startX = Math.random() * window.innerWidth;

            gsap.fromTo(
                particle,
                {
                    y: startY,
                    x: startX,
                    rotation: 0,
                },
                {
                    y: endY,
                    x: startX + (Math.random() - 0.5) * 100,
                    rotation: 360,
                    duration: 5 + Math.random() * 3,
                    repeat: -1,
                    ease: 'none',
                    delay: Math.random() * 3,
                }
            );
        });
    };

    // Fog animation - drifting fog layers
    const animateFog = () => {
        const particles = particlesRef.current;

        particles.forEach((particle, i) => {
            gsap.fromTo(
                particle,
                {
                    x: -300,
                    opacity: 0.1,
                },
                {
                    x: window.innerWidth + 300,
                    opacity: 0.3,
                    duration: 40 + i * 5,
                    repeat: -1,
                    ease: 'none',
                    delay: i * 5,
                }
            );
        });
    };

    // Render particles based on weather type
    const renderParticles = () => {
        const count = backgroundType === 'rain' || backgroundType === 'thunderstorm' ? 50 :
            backgroundType === 'snow' ? 30 :
                backgroundType === 'fog' ? 5 : 8;

        return Array.from({ length: count }).map((_, i) => {
            let particleStyle = {};

            switch (backgroundType) {
                case 'sunny':
                    particleStyle = {
                        position: 'absolute',
                        top: '10%',
                        left: '50%',
                        width: '400px',
                        height: '4px',
                        background: 'linear-gradient(90deg, transparent, rgba(255, 220, 100, 0.6), transparent)',
                        transformOrigin: '0 0',
                        transform: `rotate(${i * (360 / count)}deg)`,
                    };
                    break;

                case 'cloudy':
                    particleStyle = {
                        position: 'absolute',
                        top: `${10 + i * 15}%`,
                        left: '-200px',
                        width: `${150 + Math.random() * 100}px`,
                        height: `${60 + Math.random() * 40}px`,
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '50%',
                        filter: 'blur(20px)',
                    };
                    break;

                case 'rain':
                case 'thunderstorm':
                    particleStyle = {
                        position: 'absolute',
                        top: '-50px',
                        left: `${Math.random() * 100}%`,
                        width: '2px',
                        height: `${20 + Math.random() * 20}px`,
                        background: 'rgba(174, 194, 224, 0.6)',
                        borderRadius: '2px',
                    };
                    break;

                case 'snow':
                    particleStyle = {
                        position: 'absolute',
                        top: '-50px',
                        left: `${Math.random() * 100}%`,
                        width: `${6 + Math.random() * 6}px`,
                        height: `${6 + Math.random() * 6}px`,
                        background: 'rgba(255, 255, 255, 0.8)',
                        borderRadius: '50%',
                        boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
                    };
                    break;

                case 'fog':
                    particleStyle = {
                        position: 'absolute',
                        top: `${20 + i * 20}%`,
                        left: '-300px',
                        width: '600px',
                        height: '200px',
                        background: 'rgba(200, 200, 200, 0.2)',
                        borderRadius: '50%',
                        filter: 'blur(60px)',
                    };
                    break;

                default:
                    particleStyle = {};
            }

            return (
                <div
                    key={i}
                    ref={(el) => (particlesRef.current[i] = el)}
                    style={particleStyle}
                    className="gpu-accelerated no-select"
                />
            );
        });
    };

    // Background gradient based on weather
    const getGradient = () => {
        switch (backgroundType) {
            case 'sunny':
                return 'linear-gradient(to bottom, #1e3a8a, #f59e0b, #fbbf24)';
            case 'cloudy':
                return 'linear-gradient(to bottom, #374151, #6b7280, #9ca3af)';
            case 'rain':
                return 'linear-gradient(to bottom, #1e293b, #334155, #475569)';
            case 'thunderstorm':
                return 'linear-gradient(to bottom, #1f2937, #4c1d95, #5b21b6)';
            case 'snow':
                return 'linear-gradient(to bottom, #dbeafe, #bfdbfe, #93c5fd)';
            case 'fog':
                return 'linear-gradient(to bottom, #4b5563, #6b7280, #9ca3af)';
            default:
                return 'linear-gradient(to bottom, #374151, #6b7280, #9ca3af)';
        }
    };

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 -z-10 overflow-hidden transition-all duration-1000"
            style={{
                background: getGradient(),
            }}
        >
            {renderParticles()}
        </div>
    );
};

export default AnimatedBackground;
