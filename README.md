# Weather Now 

A clean, fast, and intuitive weather application designed for outdoor enthusiasts who need quick access to current weather conditions for any city worldwide.

##  Problem Statement

Jamie is an outdoor enthusiast who loves planning spontaneous hikes, runs, and outdoor adventures. However, before heading out, Jamie needs a quick and reliable way to check the current weather conditions for any city. Most weather apps feel cluttered with ads, forecasts, and complex data, making it hard to find the essential information quickly.

**Weather Now** solves this problem by providing a clean, fast, and intuitive way for users like Jamie to instantly view real-time weather details for any location.

## Features

-  **Instant Weather Search** — Get current conditions by searching for any city name
-  **Geolocation Support** — Automatically detect and display weather for your current location
-  **Detailed Weather Metrics** — View temperature, humidity, wind speed, UV index, pressure, and more
-  **24-Hour Forecast** — See hourly weather predictions with temperature and humidity
-  **7-Day Forecast** — Plan ahead with a week-long weather outlook
-  **Temperature Trend Chart** — Visualize temperature changes over the next 7 days
-  **Dynamic Background** — UI adapts based on current weather conditions (clear, rainy, snowy, etc.)
-  **Fully Responsive** — Works seamlessly on desktop, tablet, and mobile devices
-  **Temperature Units** — Toggle between Celsius and Fahrenheit
-  **Fast & Lightweight** — Optimized performance with real-time data from Open-Meteo API
-  **Smart Error Handling** — Clear, user-friendly messages for invalid cities or network issues

## Tech Stack

- **Frontend Framework**: React 18 with Hooks
- **Styling**: Tailwind CSS with custom glassmorphism design
- **API**: [Open-Meteo API](https://open-meteo.com/) for weather data
- **Geocoding**: Open-Meteo Geocoding API for city lookups
- **State Management**: React useState and useEffect hooks
- **Visualization**: Custom SVG-based charts and weather icons
- **Deployment**: Netlify

##  Project Structure

```
weather-now/
├── src/
│   ├── components/
│   │   ├── SearchBar.jsx       # City search input with location button
│   │   ├── WeatherCard.jsx     # Main weather display with current conditions
│   │   ├── HourlyRow.jsx       # 24-hour forecast cards
│   │   └── TrendChart.jsx      # 7-day temperature visualization
│   ├── api.js                  # API helper functions for fetching weather data
│   ├── App.jsx                 # Main application component
│   ├── index.css               # Global styles and custom CSS
│   └── main.jsx                # React entry point
├── public/
├── package.json
└── README.md
```

##  Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Nandu200394/Weather-Now-.git
   cd Weather-Now-
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

##  Live Demo

**Deployed Application**: [https://6901d6758155ffc90383ef5c--subtle-khapse-90a869.netlify.app/](https://6901d6758155ffc90383ef5c--subtle-khapse-90a869.netlify.app/)

##  How It Works

1. **Search by City**: Enter any city name in the search bar and press "Go"
2. **Use Current Location**: Click the "My Location" button to get weather for your current coordinates
3. **View Details**: See current temperature, weather conditions, humidity, wind speed, UV index, and atmospheric pressure
4. **Explore Forecast**: Scroll through the 24-hour forecast and 7-day outlook
5. **Toggle Units**: Switch between Celsius and Fahrenheit with a single click
6. **Persistent Storage**: Your last searched city and temperature preference are saved locally

##  Design Philosophy

Weather Now features an **outdoor-inspired, glassmorphism design** with:

- **Dynamic Gradients**: Background colors adapt based on weather conditions (sunny, cloudy, rainy, snowy, foggy, night)
- **Natural Color Palette**: Soft blues, greens, and earth tones for a calming experience
- **Glass Cards**: Semi-transparent cards with backdrop blur for a modern, elegant look
- **Smooth Animations**: Subtle transitions and hover effects for enhanced interactivity
- **Responsive Layout**: Flexible grid system that adapts from mobile to desktop

### Color Scheme
- **Background**: Dynamic gradients (e.g., sunny: `#FDE68A → #93C5FD → #EAF6EE`)
- **Glass Cards**: `rgba(255, 255, 255, 0.9)` with backdrop blur
- **Accents**: Blue tones (`#0369a1`, `#60a5fa`) and green highlights (`#88B04B`)
- **Text**: Dark slate (`#052029`, `#0f172a`) for readability

##  Key Features Implementation

### Dynamic Background
The app analyzes the current weather code and time of day to select an appropriate gradient:
- Clear skies: Warm yellows and blues
- Cloudy: Soft grays and blues
- Rain: Deep blues and grays
- Snow: White and light blue tones
- Night: Dark blues and blacks

### Error Handling
- **Invalid City**: "City not found. Try another name."
- **Network Error**: "Failed to fetch weather."
- **Geolocation Denied**: "Permission denied or location unavailable."

### Responsive Design Breakpoints
- **Desktop (lg)**: Full sidebar with 7-day forecast
- **Tablet (md)**: Stacked layout with adjusted grid
- **Mobile (sm)**: Horizontal scrolling for hourly forecast, vertical layout
- **Extra Small (<460px)**: Optimized for narrow screens

##  API Usage

### Open-Meteo Weather API
```javascript
https://api.open-meteo.com/v1/forecast?
  latitude={lat}&
  longitude={lon}&
  current_weather=true&
  hourly=temperature_2m,relativehumidity_2m,windspeed,...&
  daily=temperature_2m_max,sunrise,sunset,...
```

### Geocoding API
```javascript
https://geocoding-api.open-meteo.com/v1/search?name={cityName}&count=1
```

##  Development Process

This project was developed with assistance from **ChatGPT** for:
- Problem statement and user persona refinement
- UI/UX design decisions and color palette selection
- React architecture and state management patterns
- Error handling strategies
- Responsive design best practices

**ChatGPT Conversation**: [View full conversation](https://chatgpt.com/share/6900abae-f84c-8002-a230-6f35502de748)

##  Known Issues & Future Improvements

### Planned Enhancements
-  **Interactive Map**: Visualize weather patterns on a world map
-  **Weather Alerts**: Push notifications for severe weather conditions
-  **Favorites**: Save multiple cities for quick access
-  **Dark Mode**: Toggle between light and dark themes
-  **Background Images**: Dynamic photos based on weather and time
-  **Detailed Metrics**: Air quality index, pollen count, visibility
-  **PWA Support**: Install as a mobile app with offline capabilities

### Current Limitations
- Browser localStorage is used for persistence (not recommended for production)
- No authentication or user accounts
- Limited to Open-Meteo API rate limits

##  Contributing

This is a take-home challenge project, but suggestions and feedback are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Commit your changes (`git commit -m 'Add some improvement'`)
4. Push to the branch (`git push origin feature/improvement`)
5. Open a Pull Request

##  License

This project is open source and available under the [MIT License](LICENSE).

##  Author

**Vankalapati Sunandha**
- GitHub: [@Nandu200394](https://github.com/Nandu200394)
- Project Repository: [Weather-Now-](https://github.com/Nandu200394/Weather-Now-)
- Naukri Candidate ID: **Naukri1025**
##  Acknowledgments

- **Open-Meteo**: For providing a free, open-source weather API
- **ChatGPT**: For assistance with design decisions and development guidance
- **Tailwind CSS**: For utility-first CSS framework
- **React Community**: For excellent documentation and resources

---

*Last updated: October 29, 2025*