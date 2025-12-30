import React, { useEffect, useRef } from 'react';


const AdBanner = () => {
    const adRef = useRef(null);

    useEffect(() => {
        try {
            // Only push ad if adsbygoogle is available and ad hasn't been initialized
            if (window.adsbygoogle && adRef.current) {
                // Check if this ad has already been initialized
                const isInitialized = adRef.current.getAttribute('data-ad-status');

                if (!isInitialized) {
                    window.adsbygoogle.push({});
                }
            }
        } catch (error) {
            console.error('AdSense error:', error);
        }
    }, []);

    return (
        <div className="ad-banner-container fixed bottom-0 left-0 right-0 z-40 px-4 py-3 glass glass-border backdrop-blur-md">
            <div className="container mx-auto max-w-7xl">
                {/* Ad Label */}
                <div className="text-center mb-2">
                    <span className="text-white/40 text-xs uppercase tracking-wider">
                        Advertisement
                    </span>
                </div>

                {/* AdSense Ad Unit */}
                <div className="flex justify-center items-center">
                    <ins
                        ref={adRef}
                        className="adsbygoogle"
                        style={{ display: 'block' }}
                        data-ad-client="ca-pub-XXXXXXXXXXXXXXXXX"
                        data-ad-slot="XXXXXXXXXX"
                        data-ad-format="auto"
                        data-full-width-responsive="true"
                    ></ins>
                </div>

                {/* Fallback for development */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="text-center mt-2">
                        <p className="text-white/30 text-xs">
                            Ad placeholder (Replace with your AdSense credentials)
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdBanner;
