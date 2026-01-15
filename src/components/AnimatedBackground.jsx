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

        // Cleanup previous animations
        if (timelineRef.current) {
            timelineRef.current.kill();
        }
        gsap.killTweensOf(containerRef.current);
        gsap.killTweensOf(".weather-particle"); // Kill all particle animations

        // Create new timeline
        timelineRef.current = gsap.timeline();
        const tl = timelineRef.current;

        // Reset container (important for lightning to not get stuck)
        gsap.set(containerRef.current, { clearProps: "backgroundColor" });

        switch (backgroundType) {
            case 'sunny':
                animateSunny(tl);
                break;
            case 'cloudy':
                animateCloudy(tl);
                break;
            case 'rain':
                animateRain(tl);
                break;
            case 'thunderstorm':
                animateThunderstorm(tl);
                break;
            case 'snow':
                animateSnow(tl);
                break;
            case 'fog':
                animateFog(tl);
                break;
            default:
                animateCloudy(tl);
        }

        return () => {
            if (timelineRef.current) {
                timelineRef.current.kill();
            }
            gsap.killTweensOf(".weather-particle");
        };
    }, [backgroundType]);

    // --- Sunny Animation ---
    const animateSunny = (tl) => {
        const particles = particlesRef.current;
        const sunBeams = particles.filter(p => p && p.classList.contains('sun-beam'));
        const sunOrb = particles.find(p => p && p.classList.contains('sun-orb'));

        // Sun Orb Glow
        if (sunOrb) {
            gsap.to(sunOrb, {
                boxShadow: "0 0 100px 40px rgba(255, 200, 0, 0.6)",
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        }

        // Rotating Rays
        if (sunBeams.length > 0) {
            gsap.to(sunBeams, {
                rotation: "+=360",
                duration: 60,
                repeat: -1,
                ease: "none",
                transformOrigin: "center center" // Ensure rotation is around the sun
            });

            sunBeams.forEach((beam) => {
                gsap.to(beam, {
                    opacity: 0.4 + Math.random() * 0.4,
                    duration: 2 + Math.random() * 2,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut"
                });
            });
        }
    };

    // --- Cloudy Animation ---
    const animateCloudy = (tl) => {
        const particles = particlesRef.current;
        const clouds = particles.filter(p => p && p.classList.contains('cloud'));

        clouds.forEach((cloud, i) => {
            const speed = 40 + Math.random() * 40;
            const startX = -300;

            gsap.fromTo(cloud,
                { x: startX },
                {
                    x: window.innerWidth + 300,
                    duration: speed,
                    repeat: -1,
                    ease: "none",
                    delay: -Math.random() * speed // Start at random positions
                }
            );
        });
    };

    // --- Rain Animation ---
    const animateRain = (tl) => {
        const particles = particlesRef.current;
        const drops = particles.filter(p => p && p.classList.contains('rain-drop'));

        drops.forEach((drop) => {
            const duration = 0.5 + Math.random() * 0.5;
            const delay = Math.random() * 2;

            gsap.fromTo(drop,
                { y: -100, x: Math.random() * window.innerWidth },
                {
                    y: window.innerHeight + 100,
                    duration: duration,
                    repeat: -1,
                    ease: "none",
                    delay: delay
                }
            );
        });
    };

    // --- Thunderstorm Animation ---
    const animateThunderstorm = (tl) => {
        // Reuse rain animation logic
        animateRain(tl);

        // Lightning flashes
        const flash = () => {
            // Random flash intensity and duration
            const intensity = 0.4 + Math.random() * 0.4;
            const flashDuration = 0.1 + Math.random() * 0.2;

            gsap.to(containerRef.current, {
                backgroundColor: `rgba(255, 255, 255, ${intensity})`,
                duration: 0.1,
                yoyo: true,
                repeat: 3, // Several quick flashes
                onComplete: () => {
                    gsap.set(containerRef.current, { backgroundColor: "transparent" }); // Reset
                    gsap.delayedCall(2 + Math.random() * 5, flash); // Schedule next flash
                }
            });
        };

        // Start first flash after a short delay
        gsap.delayedCall(1, flash);
    };

    // --- Snow Animation ---
    const animateSnow = (tl) => {
        const particles = particlesRef.current;
        const flakes = particles.filter(p => p && p.classList.contains('snow-flake'));

        flakes.forEach((flake) => {
            const duration = 5 + Math.random() * 5;
            const startX = Math.random() * window.innerWidth;

            // Falling
            gsap.fromTo(flake,
                { y: -50, x: startX, rotation: 0 },
                {
                    y: window.innerHeight + 50,
                    rotation: 360,
                    duration: duration,
                    repeat: -1,
                    ease: "none",
                    delay: Math.random() * 5
                }
            );

            // Swaying
            gsap.to(flake, {
                x: `+=${50 + Math.random() * 50}`, // Sway to right
                duration: duration / 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        });
    };

    // --- Fog Animation ---
    const animateFog = (tl) => {
        const particles = particlesRef.current;
        const fogLayers = particles.filter(p => p && p.classList.contains('fog-layer'));

        fogLayers.forEach((layer, i) => {
            const duration = 20 + i * 10;

            gsap.fromTo(layer,
                { x: -window.innerWidth * 0.5 },
                {
                    x: window.innerWidth * 0.5,
                    duration: duration,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut"
                }
            );
        });
    };

    // --- Render Logic ---
    const renderParticles = () => {
        particlesRef.current = []; // Reset refs

        // Configuration for each weather type
        switch (backgroundType) {
            case 'sunny':
                // Sun Orb + Rays
                return (
                    <div className="absolute top-[-10%] left-[80%] w-[500px] h-[500px] flex items-center justify-center transform -translate-x-1/2">
                        {/* Sun Orb */}
                        <div
                            ref={el => particlesRef.current.push(el)}
                            className="weather-particle sun-orb absolute w-32 h-32 bg-yellow-300 rounded-full blur-xl opacity-90 z-10"
                        />
                        {/* Rays */}
                        {[...Array(12)].map((_, i) => (
                            <div
                                key={i}
                                ref={el => particlesRef.current.push(el)}
                                className="weather-particle sun-beam absolute w-[800px] h-[40px] bg-gradient-to-r from-yellow-200/40 to-transparent blur-md transform origin-left"
                                style={{ transform: `rotate(${i * 30}deg) translateX(50px)` }}
                            />
                        ))}
                    </div>
                );

            case 'cloudy':
                // Moving Clouds
                return [...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        ref={el => particlesRef.current.push(el)}
                        className="weather-particle cloud absolute rounded-full blur-[40px]"
                        style={{
                            top: `${10 + Math.random() * 40}%`,
                            width: `${200 + Math.random() * 300}px`,
                            height: `${100 + Math.random() * 100}px`,
                            background: 'rgba(255, 255, 255, 0.15)',
                        }}
                    />
                ));

            case 'rain':
            case 'thunderstorm':
                // Raindrops
                return [...Array(100)].map((_, i) => (
                    <div
                        key={i}
                        ref={el => particlesRef.current.push(el)}
                        className="weather-particle rain-drop absolute w-[1px] bg-blue-200/50"
                        style={{
                            height: `${10 + Math.random() * 20}px`, // Varying lengths
                        }}
                    />
                ));

            case 'snow':
                // Snowflakes
                return [...Array(50)].map((_, i) => (
                    <div
                        key={i}
                        ref={el => particlesRef.current.push(el)}
                        className="weather-particle snow-flake absolute bg-white rounded-full blur-[1px]"
                        style={{
                            width: `${4 + Math.random() * 6}px`,
                            height: `${4 + Math.random() * 6}px`,
                            opacity: 0.6 + Math.random() * 0.4
                        }}
                    />
                ));

            case 'fog':
                // Fog Layers
                return [...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        ref={el => particlesRef.current.push(el)}
                        className="weather-particle fog-layer absolute w-[200vw] left-[-50vw] h-screen bg-gradient-to-t from-gray-400/20 via-gray-300/10 to-transparent blur-[80px]"
                        style={{
                            top: 0
                        }}
                    />
                ));

            default:
                return null;
        }
    };

    const getGradient = () => {
        switch (backgroundType) {
            case 'sunny':
                return 'linear-gradient(to bottom, #3b82f6, #60a5fa, #93c5fd)'; // Bright Blue Sky
            case 'cloudy':
                return 'linear-gradient(to bottom, #475569, #64748b, #94a3b8)'; // Grayish Blue
            case 'rain':
                return 'linear-gradient(to bottom, #1e293b, #334155, #475569)'; // Dark Slate
            case 'thunderstorm':
                return 'linear-gradient(to bottom, #0f172a, #1e1b4b, #312e81)'; // Deep Purple/Dark Blue
            case 'snow':
                return 'linear-gradient(to bottom, #bfdbfe, #dbeafe, #eff6ff)'; // Icy Blue
            case 'fog':
                return 'linear-gradient(to bottom, #6b7280, #9ca3af, #d1d5db)'; // Gray Fog
            default:
                return 'linear-gradient(to bottom, #3b82f6, #60a5fa)';
        }
    };


    return (
        <div
            ref={containerRef}
            className="fixed inset-0 -z-10 overflow-hidden transition-colors duration-1000"
            style={{
                background: getGradient(),
            }}
        >
            {renderParticles()}
        </div>
    );
};

export default AnimatedBackground;
