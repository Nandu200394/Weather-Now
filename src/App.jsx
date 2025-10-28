
import React, { useEffect, useState } from "react";
import SearchBar from "./components/SearchBar";
import Hourly from "./components/HourlyRow";
import WeatherCard from "./components/WeatherCard";
import TrendChart from "./components/TrendChart";
import { fetchWeatherByCityName, fetchWeatherByCoords } from "./api";
import "./index.css";

/* Apple-style gradient presets (soft, pleasant) */
const GRADIENTS = {
  clear: "linear-gradient(180deg,#FDE68A 0%, #93C5FD 55%, #EAF6EE 100%)",
  partly: "linear-gradient(180deg,#EFF6FF 0%, #CFEFFD 55%, #F7F7EF 100%)",
  overcast: "linear-gradient(180deg,#D1DCE8 0%, #B9C9DB 55%, #9FB1C8 100%)",
  rain: "linear-gradient(180deg,#9FB6C8 0%, #6B9AB8 55%, #2E4F66 100%)",
  snow: "linear-gradient(180deg,#F0F8FF 0%, #E6F2FB 55%, #FEFAFA 100%)",
  fog: "linear-gradient(180deg,#ECEFF1 0%, #D7DEE6 55%, #F7F9FB 100%)",
  night: "linear-gradient(180deg,#071228 0%, #0B2B44 55%, #071028 100%)",
  default: "linear-gradient(180deg,#F0F4F8 0%, #E0F0FF 55%, #FFF9F0 100%)",
};

function pickGradient(weathercode, hour = null) {
  if (weathercode == null) return GRADIENTS.default;
  if ([0].includes(weathercode)) return GRADIENTS.clear;
  if ([1, 2].includes(weathercode)) return GRADIENTS.partly;
  if ([3, 45, 48].includes(weathercode)) return GRADIENTS.overcast;
  if ([51, 61, 80, 81, 82].includes(weathercode)) return GRADIENTS.rain;
  if ([71, 77, 85, 86].includes(weathercode)) return GRADIENTS.snow;
  if ([56, 57, 66, 67].includes(weathercode)) return GRADIENTS.fog;
  if (hour !== null && (hour < 6 || hour >= 19)) return GRADIENTS.night;
  return GRADIENTS.default;
}

export default function App() {
  const [data, setData] = useState(null);
  const [unit, setUnit] = useState(localStorage.getItem("wn:unit") || "c");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const weatherCode = data?.current?.weathercode ?? null;
  let currHour = null;
  try {
    if (data?.current?.time) currHour = new Date(data.current.time).getHours();
  } catch {}
  const gradient = pickGradient(weatherCode, currHour);

  const bgStyle = {
    background: gradient,
    transition: "background 900ms ease",
    minHeight: "100vh",
    padding: 20,
    boxSizing: "border-box",
  };

  useEffect(() => {
    const last = localStorage.getItem("wn:lastCity");
    if (last) {
      (async () => {
        setLoading(true);
        try {
          const res = await fetchWeatherByCityName(last, unit);
          setData(res);
        } catch {
          /* ignore */
        } finally {
          setLoading(false);
        }
      })();
    }
  }, []);

  const handleSearch = async (city) => {
    setError(null);
    setLoading(true);
    setData(null);
    try {
      const res = await fetchWeatherByCityName(city, unit);
      if (!res._coords && res.place) res._coords = res._coords || null;
      setData(res);
      localStorage.setItem("wn:lastCity", city);
    } catch (err) {
      if (err.code === "NO_CITY") setError("City not found. Try another name.");
      else setError(err.message || "Failed to fetch weather.");
    } finally {
      setLoading(false);
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported in this browser.");
      return;
    }
    setError(null);
    setLoading(true);
    setData(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const geoUrl = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&language=en`;
          const r = await fetch(geoUrl);
          const j = await r.json();
          const best = j?.results?.[0];
          const place = {
            name: best?.name || "Current location",
            country: best?.country || "",
            latitude: lat,
            longitude: lon,
            timezone: best?.timezone || "auto",
          };
          const res = await fetchWeatherByCoords(place, unit);
          res._coords = { latitude: lat, longitude: lon };
          setData(res);
          localStorage.setItem("wn:lastCity", place.name);
        } catch (err) {
          setError(err.message || "Failed to fetch location weather");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setLoading(false);
        setError("Permission denied or location unavailable.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    localStorage.setItem("wn:unit", unit);
    if (!data?.place) return;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        if (data._coords) {
          const place = {
            name: data.place.name,
            country: data.place.country,
            latitude: data._coords.latitude,
            longitude: data._coords.longitude,
            timezone: data.timezone,
          };
          const res = await fetchWeatherByCoords(place, unit);
          res._coords = place;
          setData(res);
        } else {
          const res = await fetchWeatherByCityName(`${data.place.name}`, unit);
          setData(res);
        }
      } catch (err) {
        setError(err.message || "Failed to update unit");
      } finally {
        setLoading(false);
      }
    })();
  }, [unit]);

  const sevenTemps = data?.daily?.temperature_2m_max?.slice(0, 7) ?? [];

  return (
    <div style={bgStyle}>
      <div className="app-container mx-auto max-w-[1200px]">
        
        {/* ✅ Updated modern inline header */}
        <header className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center flex-wrap gap-3">
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
              Weather<span className="text-blue-600">Now</span>
            </h1>

            <div className="flex items-center gap-2">
              <button
                className="btn glass text-sm px-3 py-1"
                onClick={() => setUnit((u) => (u === "c" ? "f" : "c"))}
                aria-pressed={unit === "f"}
              >
                {unit === "c" ? "°C" : "°F"}
              </button>

              <button
                className="btn glass text-sm px-3 py-1 flex items-center gap-1"
                onClick={handleUseMyLocation}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                My Location
              </button>
            </div>
          </div>

          <div className="w-full sm:w-[400px] md:w-[480px] lg:w-[520px]">
            <SearchBar onSearch={handleSearch} loading={loading} />
          </div>
        </header>

        {/* Rest of your app remains unchanged */}
        {loading && <div className="info glass-card">Loading…</div>}
        {error && <div className="alert">{error}</div>}

        <main className="grid gap-6 lg:grid-cols-[1fr_360px] fade-in">
          <div>
            {data ? (
              <>
                <WeatherCard data={{ ...data, _unit: unit }} />
                <section className="mt-5">
                  <h3 className="section-title">Hourly</h3>
                  <Hourly hourly={data.hourly} />
                </section>
                <section className="mt-5">
                  <h3 className="section-title">Hourly details</h3>
                  <div className="glass-card overflow-auto" style={{ padding: 8 }}>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs text-slate-600">
                          <th className="pr-4">Time</th>
                          <th className="pr-4">Temp</th>
                          <th className="pr-4">Dew</th>
                          <th className="pr-4">Humidity</th>
                          <th className="pr-4">Wind</th>
                          <th className="pr-4">Pressure</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.hourly.time.slice(0, 24).map((t, i) => (
                          <tr key={t} className="border-b border-white/5">
                            <td className="py-2">
                              {new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </td>
                            <td className="py-2">{Math.round(data.hourly.temperature_2m[i])}°</td>
                            <td className="py-2">{Math.round(data.hourly.dewpoint_2m?.[i] ?? 0)}°</td>
                            <td className="py-2">{Math.round(data.hourly.relativehumidity_2m?.[i] ?? 0)}%</td>
                            <td className="py-2">{Math.round(data.hourly.windspeed?.[i] ?? 0)} km/h</td>
                            <td className="py-2">{Math.round(data.hourly.surface_pressure?.[i] ?? 0)} mbar</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </>
            ) : (
              <div className="empty-state glass-card">
                Search a city or use your location to get started 🌍
              </div>
            )}
          </div>

          <aside className="space-y-4">
            {data && (
              <>
                <section>
                  <h3 className="section-title">7-Day Forecast</h3>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                    {data.daily.time.slice(0, 7).map((d, i) => (
                      <div key={d} className="day-card flex items-center justify-between">
                        <div>
                          <div className="text-xs text-slate-700">
                            {new Date(d).toLocaleDateString([], { weekday: "short" })}
                          </div>
                          <div className="font-bold text-lg">
                            {Math.round(data.daily.temperature_2m_max[i])}°
                          </div>
                          <div className="text-xs text-slate-700">
                            L {Math.round(data.daily.temperature_2m_min[i])}°
                          </div>
                        </div>
                        <div className="text-2xl">
                          <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden>
                            <circle cx="12" cy="12" r="8" fill="#FFD05A" />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <div className="glass-card">
                  <div className="font-semibold text-sm">Temperature trend</div>
                  <div className="mt-3">
                    <TrendChart values={sevenTemps} unit={unit} width={320} height={92} />
                  </div>
                </div>

                <div className="grid gap-3">
                  <div className="glass-card">
                    <div className="text-xs muted">Sunrise</div>
                    <div className="font-semibold">
                      {data.daily.sunrise?.[0]
                        ? new Date(data.daily.sunrise[0]).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                        : "—"}
                    </div>
                  </div>
                  <div className="glass-card">
                    <div className="text-xs muted">Sunset</div>
                    <div className="font-semibold">
                      {data.daily.sunset?.[0]
                        ? new Date(data.daily.sunset[0]).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                        : "—"}
                    </div>
                  </div>
                </div>
              </>
            )}
          </aside>
        </main>

        <footer className="mt-6 text-center text-slate-700">
          © 2025 Weather Now — Powered by Open-Meteo
        </footer>
      </div>
    </div>
  );
}
