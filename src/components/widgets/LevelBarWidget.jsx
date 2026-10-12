import React from 'react'
import { getScale, getColors, getZone, zoneColor, formatNumber } from '../../lib/widgetSettings.js'

const ZONE_LABELS = {
  low: 'Debajo de alerta baja',
  high: 'Arriba de alerta alta',
  normal: 'Dentro de rango',
}

export function LevelBarWidget({ variable, settings = {} }) {
  if (!variable) return null

  const val = typeof variable.value === 'number' ? variable.value : Number(variable.value) || 0
  const unit = settings.unit || ''

  const { min, max } = getScale(settings)
  const range = max - min === 0 ? 1 : max - min
  const pct = Math.max(0, Math.min(100, ((val - min) / range) * 100))

  const colors = getColors(settings)
  const zone = getZone(val, settings)
  const activeColor = zoneColor(zone, colors)

  return (
    <div className="flex flex-col justify-between h-full pt-1">
      {/* Top Value Display */}
      <div className="flex items-baseline justify-between mb-2">
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-extrabold font-mono tracking-tight" style={{ color: activeColor }}>
            {formatNumber(val, 2)}
          </span>
          {unit && <span className="text-xs font-bold text-slate-400 font-mono">{unit}</span>}
        </div>
        <div className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800">
          <span style={{ color: activeColor }}>{pct.toFixed(0)}%</span>
        </div>
      </div>

      {/* Level / Progress Bar */}
      <div className="my-auto py-2">
        <div className="w-full h-6 bg-slate-950 rounded-xl border border-slate-800 p-1 overflow-hidden relative shadow-inner">
          <div
            className="h-full rounded-lg transition-all duration-500 ease-out shadow-md"
            style={{ width: `${pct}%`, backgroundColor: activeColor }}
          />

          <div className="absolute inset-0 flex justify-between px-3 items-center pointer-events-none opacity-20">
            <div className="w-px h-3 bg-white" />
            <div className="w-px h-3 bg-white" />
            <div className="w-px h-3 bg-white" />
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span style={{ color: activeColor }}>{zone ? `● ${ZONE_LABELS[zone]}` : '● En vivo'}</span>
          <span className="text-slate-500">
            {formatNumber(min)} – {formatNumber(max)} {unit}
          </span>
        </div>
      </div>
    </div>
  )
}
