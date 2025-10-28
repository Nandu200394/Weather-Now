
import React from "react";


function hourLabel(dtStr) {
  try {
    const d = new Date(dtStr);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return dtStr;
  }
}

export default function Hourly({ hourly }) {
  if (!hourly) return null;

  const times = hourly.time || [];
  const temps = hourly.temperature_2m || [];
  const hum = hourly.relativehumidity_2m || [];
  const items = times.slice(0, 24).map((t, i) => ({
    time: t,
    temp: temps[i],
    humidity: hum[i],
  }));

  return (
    <div className="hourly-grid">
      {items.map((it, idx) => (
        <div key={it.time + idx} className="hour-card glass-card p-3 text-center">
          <div className="text-xs text-slate-700">{hourLabel(it.time)}</div>
          <div className="text-lg font-extrabold mt-1">{Math.round(it.temp)}°</div>
          <div className="text-xs text-slate-600 mt-1">💧 {Math.round(it.humidity ?? 0)}%</div>
        </div>
      ))}
    </div>
  );
}
