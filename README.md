# 🌦️ Real-Time Weather App

A premium, real-time weather web application featuring **glassmorphism UI** and **dynamic animated backgrounds** that change based on weather conditions.

![Weather App](https://img.shields.io/badge/React-18.3-blue) ![Vite](https://img.shields.io/badge/Vite-7.3-purple) ![Tailwind](https://img.shields.io/badge/Tailwind-3.4-cyan) ![GSAP](https://img.shields.io/badge/GSAP-3.12-green)

## ✨ Features

### 🌍 Weather Data
- **Real-time weather updates** from WeatherStack API
- Display temperature, feels-like, humidity, wind speed
- Sunrise and sunset times
- Local date and time based on location timezone
- Auto-refresh every 5-10 minutes

### 🔍 Search & Location
- **Search weather by city name**
- **Automatic geolocation** detection
- Fallback to manual search if permission denied
- Location-based weather on app load

### 🎨 Premium Glassmorphism UI
- **Frosted glass cards** with backdrop blur
- Semi-transparent layers with soft glowing borders
- Smooth hover effects and transitions
- Fully responsive design (mobile, tablet, desktop)
- Custom scrollbar styling

### 🎬 GSAP Animations
- Page load entrance animations
- Weather card fade-in and slide-up
- Temperature count-up animation
- Staggered animations for detail cards
- Smooth background transitions

### 🌈 Dynamic Animated Backgrounds
Weather-based backgrounds with GSAP animations:
- ☀️ **Sunny** - Warm gradient with rotating sun rays
- ☁️ **Cloudy** - Grey gradient with slow-moving clouds
- 🌧️ **Rain** - Dark blue with falling raindrops
- ⛈️ **Thunderstorm** - Purple gradient with lightning flashes
- ❄️ **Snow** - Light blue with floating snowflakes
- 🌫️ **Fog** - Soft grey with drifting fog layers

All animations are **performance-optimized** with GPU acceleration.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- WeatherStack API key (free tier)

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd "d:\An\weather app"
   ```

2. **Install dependencies** (already done)
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_WEATHERSTACK_API_KEY=your_api_key_here
   VITE_REFRESH_INTERVAL=300000
   ```

   **Get your free API key:**
   - Visit [WeatherStack](https://weatherstack.com/product)
   - Sign up for a free account
   - Generate an API key
   - Paste it in the `.env` file

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Navigate to `http://localhost:5173`
   - Allow location permission for automatic weather detection
   - Or search for any city manually

---

## 📁 Project Structure

```
weather-app/
├── src/
│   ├── components/
│   │   ├── AnimatedBackground.jsx   # Dynamic weather backgrounds
│   │   ├── ErrorMessage.jsx         # Error display with retry
│   │   ├── LoadingState.jsx         # Loading skeletons
│   │   ├── SearchBar.jsx            # Search and location UI
│   │   ├── SunriseSunset.jsx        # Sunrise/sunset display
│   │   ├── WeatherCard.jsx          # Main weather card
│   │   └── WeatherDetails.jsx       # Weather metrics grid
│   ├── hooks/
│   │   ├── useGeolocation.js        # Browser geolocation hook
│   │   └── useWeather.js            # Weather data management
│   ├── services/
│   │   └── weatherService.js        # WeatherStack API
│   ├── utils/
│   │   ├── dateUtils.js             # Date/time formatting
│   │   └── weatherConditions.js    # Weather mapping
│   ├── App.jsx                      # Main app component
│   ├── index.css                    # Tailwind + custom styles
│   └── main.jsx                     # React entry point
├── .env                             # Environment variables
├── .env.example                     # Environment template
├── tailwind.config.js               # Tailwind configuration
├── postcss.config.js                # PostCSS configuration
└── package.json                     # Dependencies
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React (Vite)** | Fast build tool and modern React setup |
| **Tailwind CSS** | Utility-first styling with custom glassmorphism |
| **Material UI** | Icons and select UI components |
| **GSAP** | Professional-grade animations |
| **Axios** | HTTP client for API calls |
| **WeatherStack API** | Real-time weather data |

---

## 🎨 Glassmorphism Design System

### Custom Tailwind Classes

```css
.glass              /* Frosted glass effect */
.glass-dark         /* Dark glass variant */
.glass-hover        /* Hover state with scale */
.glass-border       /* Soft glowing border */
.glass-glow         /* Enhanced glow effect */
.shimmer            /* Loading shimmer animation */
```

### Usage Example
```jsx
<div className="glass glass-border glass-hover rounded-2xl p-6">
  Content here
</div>
```

---

## 🌐 API Reference

### WeatherStack API

**Endpoints Used:**
- `GET /current` - Current weather data

**Parameters:**
- `query` - City name or coordinates (lat,lon)
- `access_key` - API key
- `units=m` - Metric units (Celsius)

**Free Tier Limits:**
- 250 API calls/month
- Current weather data only
- Sufficient for testing and light usage

---

## 📱 Responsive Design

| Breakpoint | Layout |
|------------|--------|
| **Mobile** (< 640px) | Single column, stacked cards |
| **Tablet** (640px - 1024px) | Two-column grid |
| **Desktop** (> 1024px) | Four-column grid, optimized spacing |

---

## ⚡ Performance Optimizations

- **GPU acceleration** with `transform: translateZ(0)`
- **Particle count limits** for smooth animations
- **Auto-refresh caching** to reduce API calls
- **Lazy loading** for weather data
- **Debounced search** input
- **GSAP timeline cleanup** on unmount

---

## 🧪 Testing

### Manual Testing Checklist

**Geolocation:**
- [ ] Allow permission → weather loads automatically
- [ ] Deny permission → search bar available
- [ ] Retry button works after denial

**Search:**
- [ ] Valid city → weather displays correctly
- [ ] Invalid city → error message shows
- [ ] Empty search → validation prevents submission

**Weather Conditions:**
Test different cities for various backgrounds:
- Sunny: Dubai, Los Angeles
- Cloudy: London, Seattle
- Rain: Mumbai (monsoon)
- Snow: Moscow (winter)

**Animations:**
- [ ] Page loads with fade-in
- [ ] Temperature counts up smoothly
- [ ] Cards slide in with stagger
- [ ] Background transitions smoothly

**Responsive:**
- [ ] Mobile (375px) - single column
- [ ] Tablet (768px) - two columns
- [ ] Desktop (1440px) - four columns

---

## 🐛 Troubleshooting

### API Key Issues
**Error:** "Invalid API key"
- Check `.env` file exists in root directory
- Verify `VITE_WEATHERSTACK_API_KEY` is set correctly
- Restart dev server after adding `.env`

### Geolocation Not Working
**Error:** "Location permission denied"
- Ensure HTTPS in production (required for geolocation)
- Check browser permissions
- Use search bar as fallback

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📦 Build for Production

```bash
# Create optimized build
npm run build

# Preview production build
npm run preview
```

Build output will be in the `dist/` directory.

---

## 🚀 Deployment

### Recommended Platforms
- **Vercel** - Automatic deployments
- **Netlify** - Easy setup with environment variables
- **GitHub Pages** - Free hosting

### Environment Variables
Remember to set `VITE_WEATHERSTACK_API_KEY` in your deployment platform's environment settings.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- Weather data provided by [WeatherStack](https://weatherstack.com/)
- Icons from [Material UI](https://mui.com/material-ui/material-icons/)
- Animations powered by [GSAP](https://greensock.com/gsap/)

---

## 📧 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the WeatherStack API documentation
3. Ensure all dependencies are installed correctly

---

**Built with ❤️ using React, Tailwind CSS, and GSAP**
