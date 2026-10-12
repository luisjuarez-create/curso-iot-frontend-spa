import React, { useId } from 'react'
import { getScale, getColors, getZone, zoneColor, formatNumber } from '../../lib/widgetSettings.js'

export function GaugeWidget({ variable, settings = {} }) {
  const glowId = useId()
  if (!variable) return null

  const val = typeof variable.value === 'number' ? variable.value : Number(variable.value) || 0
  const unit = settings.unit || ''

  const { min, max } = getScale(settings)
  const range = max - min === 0 ? 1 : max - min

  const colors = getColors(settings)
  const arcColor = zoneColor(getZone(val, settings), colors)

  // Percentage 0 to 1
  const pct = Math.max(0, Math.min(1, (val - min) / range))

  // Semicircular arc math: center (100, 110), radius 80
  const radius = 80
  const circumference = Math.PI * radius
  const strokeDashoffset = circumference * (1 - pct)

  const valStr = formatNumber(val)

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
            y={unit ? 80 : 86}
            textAnchor="middle"
            className="font-mono font-extrabold tracking-tight select-none"
            fill={arcColor}
            fontSize={valStr.length > 5 ? 24 : valStr.length > 4 ? 28 : 34}
          >
            {valStr}
          </text>

          {/* Center Unit directly underneath */}
          {unit && (
            <text
              x="100"
              y="97"
              textAnchor="middle"
              className="font-mono font-bold select-none"
              fill="#94a3b8"
              fontSize="12"
            >
              {unit}
            </text>
          )}
        </svg>
      </div>

      {/* Footer without redundant % badge */}
      <div className="w-full flex items-center justify-between text-[10px] text-slate-400 font-mono border-t border-slate-800/80 pt-1.5 mt-1">
        <span>Escala: {formatNumber(min)}</span>
        <span className="text-slate-500">● En vivo</span>
        <span>{formatNumber(max)} {unit}</span>
      </div>
    </div>
  )
}

