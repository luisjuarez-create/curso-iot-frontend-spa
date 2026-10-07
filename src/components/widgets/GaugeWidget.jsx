import React, { useId } from 'react'

export function GaugeWidget({ variable, settings = {} }) {
  if (!variable) return null

  const glowId = useId()
  const val = typeof variable.value === 'number' ? variable.value : Number(variable.value) || 0

  // Smart defaults based on variable type if not customized in settings
  const defaultRanges = (name, vMin, vMax) => {
    const lower = (name || '').toLowerCase()
    if (lower.includes('pres')) return { min: 900, max: 1100 }
    if (lower.includes('hum')) return { min: 0, max: 100 }
    if (lower.includes('temp')) return { min: 0, max: 50 }
    if (lower.includes('bat') || lower.includes('volt')) return { min: 0, max: 5 }
    const fallbackMin = vMin !== null ? (vMin > 0 ? Math.floor(vMin * 0.9) : Math.floor(vMin * 1.1)) : 0
    const fallbackMax = vMax !== null ? (vMax > 0 ? Math.ceil(vMax * 1.1) : Math.ceil(vMax * 0.9)) : 100
    return { min: fallbackMin, max: fallbackMax === fallbackMin ? fallbackMin + 10 : fallbackMax }
  }

  const defaults = defaultRanges(variable.name, variable.min, variable.max)
  const min = settings.min !== null && settings.min !== undefined ? settings.min : defaults.min
  const max = settings.max !== null && settings.max !== undefined ? settings.max : defaults.max
  const range = max - min === 0 ? 100 : max - min

  const minColor = settings.minColor || '#06b6d4'
  const normalColor = settings.normalColor || '#10b981'
  const maxColor = settings.maxColor || '#ef4444'

  // Percentage 0 to 1
  const pct = Math.max(0, Math.min(1, (val - min) / range))

  // Semicircular arc math: center (100, 110), radius 80
  const radius = 80
  const circumference = Math.PI * radius
  const strokeDashoffset = circumference * (1 - pct)

  // Color dynamic based on percentage or thresholds
  let arcColor = normalColor
  if (pct < 0.25) arcColor = minColor
  else if (pct > 0.8) arcColor = maxColor

  const formatVal = (v) => {
    if (typeof v !== 'number' || isNaN(v)) return String(v)
    return Number.isInteger(v) ? String(v) : v.toFixed(1)
  }

  const valStr = formatVal(val)
  const formatBoundary = (num) => (num % 1 !== 0 ? num.toFixed(1) : num.toFixed(0))

  return (
    <div className="flex flex-col items-center justify-between h-full pt-1">
      {/* Gauge SVG Container */}
      <div className="relative w-full max-w-[240px] h-36 flex items-center justify-center my-auto">
        <svg viewBox="0 0 200 125" className="w-full h-full overflow-visible">
          <defs>
            <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={arcColor} floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Background Arc */}
          <path
            d="M 20 110 A 80 80 0 0 1 180 110"
            fill="none"
            stroke="#1e293b"
            strokeWidth="11"
            strokeLinecap="round"
          />

          {/* Progress Arc */}
          <path
            d="M 20 110 A 80 80 0 0 1 180 110"
            fill="none"
            stroke={arcColor}
            strokeWidth="11"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            filter={`url(#${glowId})`}
            className="transition-all duration-500 ease-out"
          />

          {/* Center Value */}
          <text
            x="100"
            y={variable.unit ? 80 : 86}
            textAnchor="middle"
            className="font-mono font-extrabold tracking-tight select-none"
            fill={arcColor}
            fontSize={valStr.length > 5 ? 24 : valStr.length > 4 ? 28 : 34}
          >
            {valStr}
          </text>

          {/* Center Unit directly underneath */}
          {variable.unit && (
            <text
              x="100"
              y="97"
              textAnchor="middle"
              className="font-mono font-bold select-none"
              fill="#94a3b8"
              fontSize="12"
            >
              {variable.unit}
            </text>
          )}
        </svg>
      </div>

      {/* Footer without redundant % badge */}
      <div className="w-full flex items-center justify-between text-[10px] text-slate-400 font-mono border-t border-slate-800/80 pt-1.5 mt-1">
        <span style={{ color: minColor }}>Mín: {formatBoundary(min)}</span>
        <span className="text-slate-500">● En vivo</span>
        <span style={{ color: maxColor }}>Máx: {formatBoundary(max)}</span>
      </div>
    </div>
  )
}

