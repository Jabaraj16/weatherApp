import React from 'react';

/**
 * Loading State Component with glassmorphism shimmer effect
 */
const LoadingState = () => {
    return (
        <div className="w-full max-w-4xl mx-auto px-4 space-y-6">
            {/* Main Weather Card Skeleton */}
            <div className="glass rounded-3xl p-8 shimmer">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-32 h-32 bg-white/20 rounded-full shimmer"></div>
                    <div className="w-48 h-12 bg-white/20 rounded-lg shimmer"></div>
                    <div className="w-64 h-6 bg-white/20 rounded-lg shimmer"></div>
                </div>
            </div>

            {/* Weather Details Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="glass rounded-2xl p-6 shimmer">
                        <div className="space-y-3">
                            <div className="w-12 h-12 bg-white/20 rounded-full shimmer"></div>
                            <div className="w-24 h-8 bg-white/20 rounded-lg shimmer"></div>
                            <div className="w-32 h-4 bg-white/20 rounded-lg shimmer"></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Sunrise/Sunset Skeleton */}
            <div className="glass rounded-2xl p-6 shimmer">
                <div className="flex justify-around items-center">
                    <div className="space-y-2">
                        <div className="w-12 h-12 bg-white/20 rounded-full shimmer mx-auto"></div>
                        <div className="w-24 h-6 bg-white/20 rounded-lg shimmer"></div>
                    </div>
                    <div className="w-px h-16 bg-white/20"></div>
                    <div className="space-y-2">
                        <div className="w-12 h-12 bg-white/20 rounded-full shimmer mx-auto"></div>
                        <div className="w-24 h-6 bg-white/20 rounded-lg shimmer"></div>
                    </div>
                </div>
            </div>

            {/* Loading Text */}
            <div className="text-center">
                <p className="text-white/80 text-lg font-medium animate-pulse">
                    Loading weather data...
                </p>
            </div>
        </div>
    );
};

export default LoadingState;
