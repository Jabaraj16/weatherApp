import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import WeatherDetails from './components/WeatherDetails';
import SunriseSunset from './components/SunriseSunset';
import FiveDayForecast from './components/FiveDayForecast';
import HourlyForecast from './components/HourlyForecast';
import AirQualityCard from './components/AirQualityCard';
import LoadingState from './components/LoadingState';
import ErrorMessage from './components/ErrorMessage';
import AnimatedBackground from './components/AnimatedBackground';
import ThemeToggle from './components/ThemeToggle';
import useWeather from './hooks/useWeather';
import useGeolocation from './hooks/useGeolocation';
import useForecast from './hooks/useForecast';

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
    forecast,
    loading: forecastLoading,
    error: forecastError,
    fetchForecastByCity,
    fetchForecastByCoords,
  } = useForecast();

  const {
    coords,
    loading: geoLoading,
    error: geoError,
    retry: retryGeolocation,
  } = useGeolocation();

  const [currentCity, setCurrentCity] = useState(null);

  // Auto-fetch weather when geolocation is available
  useEffect(() => {
    console.log('Geolocation coords:', coords);
    console.log('Current weather:', weather);
    console.log('Loading states - geo:', geoLoading, 'weather:', loading);

    if (coords && !weather && !loading) {
      console.log('Fetching weather for coords:', coords.lat, coords.lon);
      fetchWeatherByCoords(coords.lat, coords.lon);
      fetchForecastByCoords(coords.lat, coords.lon);
    }
  }, [coords, weather, loading, fetchWeatherByCoords, fetchForecastByCoords, geoLoading]);

  // Handle city search
  const handleSearch = (city) => {
    console.log('Searching for city:', city);
    setCurrentCity(city);
    fetchWeatherByCity(city);
    fetchForecastByCity(city);
  };

  // Handle location request
  const handleLocationRequest = () => {
    console.log('Location button clicked. Coords:', coords);
    if (coords) {
      fetchWeatherByCoords(coords.lat, coords.lon);
      fetchForecastByCoords(coords.lat, coords.lon);
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

  // Debug: Log API key status
  useEffect(() => {
    const apiKey = import.meta.env.VITE_WEATHERAPI_KEY;
    if (!apiKey || apiKey === 'your_api_key_here') {
      console.error('⚠️ WeatherAPI.com API key not configured! Please add your API key to .env file');
    } else {
      console.log('✅ WeatherAPI.com API key is configured');
    }
  }, []);

  return (
    <div className="app-container min-h-screen relative">
      {/* Theme Toggle */}
      <ThemeToggle />

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
            loading={loading || geoLoading || forecastLoading}
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
                    fetchForecastByCoords(coords.lat, coords.lon);
                  } else if (currentCity) {
                    fetchWeatherByCity(currentCity);
                    fetchForecastByCity(currentCity);
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

            {/* API Key Warning */}
            {!import.meta.env.VITE_WEATHERAPI_KEY && !weather && !loading && !error && (
              <div className="text-center px-4">
                <div className="glass glass-border rounded-2xl p-6 max-w-md mx-auto border-2 border-yellow-500/50">
                  <p className="text-yellow-300 font-semibold mb-2">⚠️ API Key Required</p>
                  <p className="text-white/80 text-sm mb-4">
                    Please add your WeatherAPI.com API key to the .env file:
                  </p>
                  <code className="text-white/60 text-xs bg-black/30 px-3 py-2 rounded block">
                    VITE_WEATHERAPI_KEY=your_key_here
                  </code>
                  <p className="text-white/60 text-xs mt-3">
                    Get a free key at: weatherapi.com/signup.aspx
                  </p>
                </div>
              </div>
            )}

            {/* Weather Data */}
            {weather && !loading && (
              <div className="space-y-6 md:space-y-8">
                {/* Current Weather */}
                <div className="px-4 space-y-6">
                  <WeatherCard weather={weather} />
                  <WeatherDetails weather={weather} />
                  <SunriseSunset weather={weather} />
                </div>

                {/* 5-Day Forecast */}
                {forecast && forecast.forecast && (
                  <FiveDayForecast forecast={forecast.forecast} />
                )}

                {/* Hourly Forecast */}
                {forecast && forecast.forecast && forecast.forecast[0] && (
                  <HourlyForecast hours={forecast.forecast[0].hour} />
                )}

                {/* Air Quality */}
                {forecast && forecast.airQuality && (
                  <div className="px-4">
                    <AirQualityCard airQuality={forecast.airQuality} />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <footer className="text-center mt-12 md:mt-16 px-4">
            <p className="text-white/50 text-sm">
              Powered by WeatherAPI.com
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;
