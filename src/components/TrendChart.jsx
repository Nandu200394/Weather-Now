import React from "react";

/**
 * Simple SVG line chart.
 * values: array of numbers
 * width/height: SVG size
 * Renders path and small dots + labels for min/max on the right
 */
export default function TrendChart({ values = [], unit = "c", width = 300, height = 80 }) {
  if (!values || values.length === 0) return <div className="muted">No data</div>;

  const pad = 8;
  const w = width;
  const h = height;
  const innerW = w - pad * 2;
  const innerH = h - pad * 2;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * innerW;
    const y = pad + innerH - ((v - min) / range) * innerH;
    return { x, y, v };
  });

  const d = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" ");

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden>
        <defs>
          <linearGradient id="tg" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.03" />
          </linearGradient>
        </defs>

        {/* area under curve */}
        <path d={`${d} L ${pad + innerW} ${pad + innerH} L ${pad} ${pad + innerH} Z`} fill="url(#tg)" stroke="none" />

        {/* line */}
        <path d={d} fill="none" stroke="#0369a1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {/* dots */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={2.6} fill="#0369a1" />
        ))}
      </svg>

      <div style={{ minWidth: 56 }}>
        <div style={{ fontSize: 12, color: "#063244", fontWeight: 700 }}>{max}°{unit === "c" ? "C" : "F"}</div>
        <div style={{ fontSize: 12, color: "#7c93a6" }}>{min}°</div>
      </div>
    </div>
  );
}
