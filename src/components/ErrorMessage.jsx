import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';

/**
 * Error Message Component with GSAP animations
 * @param {object} props - Component props
 * @param {string} props.message - Error message to display
 * @param {function} props.onRetry - Retry callback function
 */
const ErrorMessage = ({ message, onRetry }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current) {
            gsap.fromTo(
                containerRef.current,
                {
                    opacity: 0,
                    y: 30,
                    scale: 0.9,
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.5,
                    ease: 'back.out(1.7)',
                }
            );
        }
    }, [message]);

    return (
        <div
            ref={containerRef}
            className="w-full max-w-md mx-auto px-4"
        >
            <div className="glass glass-border rounded-2xl p-8 text-center space-y-4">
                {/* Error Icon */}
                <div className="flex justify-center">
                    <div className="glass-dark rounded-full p-4">
                        <ErrorOutlineIcon
                            className="text-red-400"
                            sx={{ fontSize: 48 }}
                        />
                    </div>
                </div>

                {/* Error Message */}
                <div>
                    <h3 className="text-white text-xl font-semibold mb-2">
                        Oops! Something went wrong
                    </h3>
                    <p className="text-white/70 text-sm">
                        {message || 'An unexpected error occurred'}
                    </p>
                </div>

                {/* Retry Button */}
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="glass glass-hover rounded-xl px-6 py-3 text-white font-medium flex items-center gap-2 mx-auto transition-all duration-300 hover:glass-glow"
                    >
                        <RefreshIcon />
                        Try Again
                    </button>
                )}
            </div>
        </div>
    );
};

export default ErrorMessage;
