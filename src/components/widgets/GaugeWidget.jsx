import React from 'react'

export function GaugeWidget({ variable }) {
  if (!variable) return null

  const val = typeof variable.value === 'number' ? variable.value : Number(variable.value) || 0
  const min = variable.min !== null ? Math.min(variable.min, 0) : 0
  const max = variable.max !== null ? Math.max(variable.max, 100) : 100
  const range = max - min === 0 ? 100 : max - min

  // Percentage 0 to 1
  const pct = Math.max(0, Math.min(1, (val - min) / range))

  // Arc math for 180-degree semicircular gauge
  const radius = 55
  const circumference = Math.PI * radius
  const strokeDashoffset = circumference * (1 - pct)

  // Color dynamic based on percentage
  const getColor = (p) => {
    if (p < 0.6) return '#10b981' // Green
    if (p < 0.85) return '#f59e0b' // Yellow
    return '#ef4444' // Red alert
  }

  const arcColor = getColor(pct)

  return (
    <div className="flex flex-col items-center justify-between h-full pt-1">
      {/* Gauge SVG */}
      <div className="relative w-44 h-28 flex items-center justify-center my-auto">
        <svg viewBox="0 0 140 85" className="w-full h-full">
          {/* Background Arc */}
          <path
            d="M 15 75 A 55 55 0 0 1 125 75"
            fill="none"
            stroke="#1e293b"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Progress Arc */}
          <path
            d="M 15 75 A 55 55 0 0 1 125 75"
            fill="none"
            stroke={arcColor}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500 ease-out"
          />

          {/* Needle / Pivot Circle */}
          <circle cx="70" cy="75" r="5" fill="#e2e8f0" />
        </svg>

        {/* Center Value */}
        <div className="absolute bottom-1 flex flex-col items-center">
          <span className="text-2xl md:text-3xl font-extrabold font-mono text-slate-100 tracking-tight leading-none">
            {val.toFixed(1)}
          </span>
          <span className="text-[11px] font-bold text-slate-400 font-mono mt-0.5">
            {variable.unit || '%'}
          </span>
        </div>
      </div>

      {/* Min/Max and Percentage footer */}
      <div className="w-full flex items-center justify-between text-[10px] text-slate-400 font-mono border-t border-slate-800/80 pt-1.5 mt-1">
        <span>Mín: {min.toFixed(0)}</span>
        <span className="px-2 py-0.5 rounded bg-slate-950 font-bold" style={{ color: arcColor }}>
          {(pct * 100).toFixed(0)}%
        </span>
        <span>Máx: {max.toFixed(0)}</span>
      </div>
    </div>
  )
}
