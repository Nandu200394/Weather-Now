
import React from "react";

/* small mapping for codes -> label + inline svg */
const weatherMap = {
  0: { label: "Clear", icon: SunSVG },
  1: { label: "Mainly clear", icon: SunCloudSVG },
  2: { label: "Partly cloudy", icon: SunCloudSVG },
  3: { label: "Overcast", icon: CloudSVG },
  45: { label: "Fog", icon: CloudSVG },
  48: { label: "Rime fog", icon: CloudSVG },
  51: { label: "Light drizzle", icon: RainSVG },
  61: { label: "Light rain", icon: RainSVG },
  80: { label: "Rain showers", icon: RainSVG },
  71: { label: "Light snow", icon: SnowSVG },
};

function getWindDirLabel(deg) {
  if (deg == null) return "";
  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const ix = Math.round((deg % 360) / 22.5) % 16;
  return dirs[ix];
}

export default function WeatherCard({ data }) {
  if (!data || !data.current) return null;
  const temp = Math.round(data.current.temperature);
  const code = data.current.weathercode;
  const meta = weatherMap[code] || { label: "Unknown", icon: CloudSVG };
  const Icon = meta.icon;
  const place = `${data.place.name}${data.place.country ? ", " + data.place.country : ""}`;

  const feels = Math.round(data.daily?.apparent_temperature_max?.[0] ?? data.current.temperature);
  const windSpeed = Math.round(data.current.windspeed ?? 0);
  const windDir = getWindDirLabel(data.current.winddirection ?? 0);
  const humidity = Math.round(data.hourly?.relativehumidity_2m?.[0] ?? 0);
  const dewpoint = Math.round(data.hourly?.dewpoint_2m?.[0] ?? 0);
  const uv = Math.round(data.daily?.uv_index_max?.[0] ?? 0);
  const pressure = Math.round(data.hourly?.surface_pressure?.[0] ?? 0);

  return (
    <div className="weather-card glass-card" style={{ padding: 16 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 14, color: "#063244", fontWeight: 700 }}>{place}</div>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 8 }}>
            <div style={{ width: 72, height: 72, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.6)", borderRadius: 16 }}>
              <Icon />
            </div>

            <div>
              <div style={{ fontSize: 44, fontWeight: 800, color: "#052029" }}>{temp}°</div>
              <div style={{ fontSize: 13, color: "#0f172a" }}>{meta.label} • Feels {feels}°</div>
            </div>
          </div>
        </div>

        <div style={{ minWidth: 220 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div className="stat small glass-card p-2">
              <div className="muted" style={{ fontSize: 12 }}>Wind</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                <div style={{ transform: `rotate(${data.current.winddirection ?? 0}deg)` }}>
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path d="M12 2 L15 8 L9 8 Z" fill="#08324a" />
                  </svg>
                </div>
                <div style={{ fontWeight: 700 }}>{windSpeed} km/h</div>
              </div>
              <div style={{ fontSize: 12, color: "#0f172a", marginTop: 6 }}>from {windDir}</div>
            </div>

            <div className="stat small glass-card p-2">
              <div className="muted" style={{ fontSize: 12 }}>Humidity</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                <div className="humidity-cylinder" aria-hidden>
                  <div className="humidity-fill" style={{ height: `${humidity}%` }} />
                </div>
                <div style={{ fontWeight: 700 }}>{humidity}%</div>
              </div>
            </div>

            <div className="stat small glass-card p-2">
              <div className="muted" style={{ fontSize: 12 }}>Dew point</div>
              <div style={{ fontWeight: 700, marginTop: 8 }}>{dewpoint}°</div>
            </div>

            <div className="stat small glass-card p-2">
              <div className="muted" style={{ fontSize: 12 }}>UV index</div>
              <div style={{ fontWeight: 700, marginTop: 8 }}>{uv} {uv <= 2 ? "(Low)" : uv <= 5 ? "(Moderate)" : "(High)"}</div>
              <div className="muted" style={{ fontSize: 12, marginTop: 8 }}>Pressure</div>
              <div style={{ marginTop: 6 }}>
                <div className="pressure-bar"><div className="pressure-fill" style={{ width: `${clampPressurePercent(pressure)}%` }} /></div>
                <div style={{ fontSize: 12, color: "#0f172a", marginTop: 6 }}>{pressure} mbar</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* small bottom row */}
      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <div className="stat-card">
          <div className="muted" style={{ fontSize: 12 }}>Sunrise</div>
          <div style={{ fontWeight: 700, marginTop: 6 }}>{data.daily.sunrise?.[0] ? new Date(data.daily.sunrise[0]).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}</div>
        </div>
        <div className="stat-card">
          <div className="muted" style={{ fontSize: 12 }}>Sunset</div>
          <div style={{ fontWeight: 700, marginTop: 6 }}>{data.daily.sunset?.[0] ? new Date(data.daily.sunset[0]).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}</div>
        </div>
        <div className="stat-card">
          <div className="muted" style={{ fontSize: 12 }}>Code</div>
          <div style={{ fontWeight: 700, marginTop: 6 }}>{data.current.weathercode ?? "—"}</div>
        </div>
      </div>
    </div>
  );
}

/* helpers & inline svg icons */
function clampPressurePercent(value) {
  const min = 960, max = 1040;
  const v = Math.max(min, Math.min(max, value || min));
  return Math.round(((v - min) / (max - min)) * 100);
}

function SunSVG() {
  return (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="4" fill="#FFD05A" />
      <g stroke="#FFD05A" strokeWidth="1">
        <path d="M12 1v2" />
        <path d="M12 21v2" />
        <path d="M1 12h2" />
        <path d="M21 12h2" />
        <path d="M4.2 4.2l1.4 1.4" />
        <path d="M18.4 18.4l1.4 1.4" />
      </g>
    </svg>
  );
}
function SunCloudSVG() {
  return (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="8" cy="7" r="3" fill="#FFD05A" />
      <path d="M5 15a4 4 0 0 1 0-8 5 5 0 0 1 9.9 1A4 4 0 0 1 19 14" fill="#fff" stroke="#cbd5e1"/>
    </svg>
  );
}
function CloudSVG() {
  return (
    <svg width="44" height="44" viewBox="0 0 24 24" aria-hidden>
      <path d="M20 15.5A4.5 4.5 0 0 0 12 7a5 5 0 0 0-7 5.5" fill="#fff" stroke="#b6c6d8"/>
    </svg>
  );
}
function RainSVG() {
  return (
    <svg width="44" height="44" viewBox="0 0 24 24" aria-hidden>
      <path d="M7 10a4 4 0 0 1 8 0" fill="#fff" stroke="#cbd5e1"/>
      <path d="M8.5 15.5v2" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round"/>
      <path d="M11.5 15.5v2" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round"/>
      <path d="M14.5 15.5v2" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}
function SnowSVG() {
  return (
    <svg width="44" height="44" viewBox="0 0 24 24" aria-hidden>
      <path d="M7 10a4 4 0 0 1 8 0" fill="#fff" stroke="#dbe9f8"/>
      <text x="50%" y="70%" textAnchor="middle" fontSize="12" fill="#93c5fd">*</text>
    </svg>
  );
}
