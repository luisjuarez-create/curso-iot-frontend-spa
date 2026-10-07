import React from 'react'

export function GaugeWidget({ variable, settings = {} }) {
  if (!variable) return null

  const val = typeof variable.value === 'number' ? variable.value : Number(variable.value) || 0

  const min = settings.min !== null && settings.min !== undefined ? settings.min : (variable.min !== null ? Math.min(variable.min, 0) : 0)
  const max = settings.max !== null && settings.max !== undefined ? settings.max : (variable.max !== null ? Math.max(variable.max, 100) : 100)
  const range = max - min === 0 ? 100 : max - min

  const minColor = settings.minColor || '#06b6d4'
  const normalColor = settings.normalColor || '#10b981'
  const maxColor = settings.maxColor || '#ef4444'

  // Percentage 0 to 1
  const pct = Math.max(0, Math.min(1, (val - min) / range))

  // Arc math for 180-degree semicircular gauge
  const radius = 55
  const circumference = Math.PI * radius
  const strokeDashoffset = circumference * (1 - pct)

  // Color dynamic based on percentage or thresholds
  let arcColor = normalColor
  if (pct < 0.3) arcColor = minColor
  else if (pct > 0.8) arcColor = maxColor

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

          {/* Pivot Circle */}
          <circle cx="70" cy="75" r="5" fill="#e2e8f0" />
        </svg>

        {/* Center Value */}
        <div className="absolute bottom-1 flex flex-col items-center">
          <span
            className="text-2xl md:text-3xl font-extrabold font-mono tracking-tight leading-none transition-colors duration-300"
            style={{ color: arcColor }}
          >
            {val.toFixed(1)}
          </span>
          <span className="text-[11px] font-bold text-slate-400 font-mono mt-0.5">
            {variable.unit || '%'}
          </span>
        </div>
      </div>

      {/* Min/Max and Percentage footer */}
      <div className="w-full flex items-center justify-between text-[10px] text-slate-400 font-mono border-t border-slate-800/80 pt-1.5 mt-1">
        <span style={{ color: minColor }}>Mín: {min.toFixed(0)}</span>
        <span className="px-2 py-0.5 rounded bg-slate-950 font-bold" style={{ color: arcColor }}>
          {(pct * 100).toFixed(0)}%
        </span>
        <span style={{ color: maxColor }}>Máx: {max.toFixed(0)}</span>
      </div>
    </div>
  )
}
