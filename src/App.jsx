import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import WeatherDetails from './components/WeatherDetails';
import SunriseSunset from './components/SunriseSunset';
import LoadingState from './components/LoadingState';
import ErrorMessage from './components/ErrorMessage';
import AnimatedBackground from './components/AnimatedBackground';
import useWeather from './hooks/useWeather';
import useGeolocation from './hooks/useGeolocation';

/**
 * Main App Component
 */
function App() {
  const {
    weather,
    loading,
    error,
    fetchWeatherByCoords,
    fetchWeatherByCity,
  } = useWeather();

  const {
    coords,
    loading: geoLoading,
    error: geoError,
    retry: retryGeolocation,
  } = useGeolocation();

  // Auto-fetch weather when geolocation is available
  useEffect(() => {
    console.log('Geolocation coords:', coords);
    if (coords && !weather) {
      console.log('Fetching weather for coords:', coords.lat, coords.lon);
      fetchWeatherByCoords(coords.lat, coords.lon);
    }
  }, [coords, weather, fetchWeatherByCoords]);

  // Handle city search
  const handleSearch = (city) => {
    fetchWeatherByCity(city);
  };

  // Handle location request
  const handleLocationRequest = () => {
    if (coords) {
      fetchWeatherByCoords(coords.lat, coords.lon);
    } else {
      retryGeolocation();
    }
  };

  // Page load animation
  useEffect(() => {
    gsap.fromTo(
      '.app-container',
      {
        opacity: 0,
      },
      {
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
      }
    );
  }, []);

  return (
    <div className="app-container min-h-screen relative">
      {/* Animated Background */}
      <AnimatedBackground condition={weather?.condition || 'Clear'} />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen py-8 md:py-12">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <header className="text-center mb-8 md:mb-12 px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-3 drop-shadow-lg">
              Weather App
            </h1>
            <p className="text-white/70 text-lg md:text-xl">
              Real-time weather updates with stunning visuals
            </p>
          </header>

          {/* Search Bar */}
          <SearchBar
            onSearch={handleSearch}
            onLocationRequest={handleLocationRequest}
            loading={loading || geoLoading}
          />

          {/* Content Area */}
          <div className="space-y-6 md:space-y-8">
            {/* Loading State */}
            {(loading || geoLoading) && !weather && <LoadingState />}

            {/* Error State */}
            {error && !loading && (
              <ErrorMessage
                message={error}
                onRetry={() => {
                  if (coords) {
                    fetchWeatherByCoords(coords.lat, coords.lon);
                  }
                }}
              />
            )}

            {/* Geolocation Error (only show if no weather data) */}
            {geoError && !weather && !loading && !error && (
              <div className="text-center px-4">
                <div className="glass glass-border rounded-2xl p-6 max-w-md mx-auto">
                  <p className="text-white/80 mb-4">{geoError}</p>
                  <p className="text-white/60 text-sm">
                    Please use the search bar to find weather for your city
                  </p>
                </div>
              </div>
            )}

            {/* Weather Data */}
            {weather && !loading && (
              <div className="space-y-6 md:space-y-8 px-4">
                {/* Main Weather Card */}
                <WeatherCard weather={weather} />

                {/* Weather Details Grid */}
                <WeatherDetails weather={weather} />

                {/* Sunrise & Sunset */}
                <SunriseSunset weather={weather} />
              </div>
            )}
          </div>

          {/* Footer */}
          <footer className="text-center mt-12 md:mt-16 px-4">
            <p className="text-white/50 text-sm">
              Powered by WeatherStack API
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;
