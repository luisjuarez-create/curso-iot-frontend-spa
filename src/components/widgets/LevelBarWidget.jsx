import React from 'react'
import { BatteryCharging, Droplets } from 'lucide-react'

export function LevelBarWidget({ variable, settings = {} }) {
  if (!variable) return null

  const val = typeof variable.value === 'number' ? variable.value : Number(variable.value) || 0
  const isBattery = variable.name.toLowerCase().includes('bat') || variable.name.toLowerCase().includes('volt')

  let min = settings.min !== null && settings.min !== undefined ? settings.min : (isBattery ? 3.0 : 0)
  let max = settings.max !== null && settings.max !== undefined ? settings.max : (isBattery ? 4.2 : 100)

  const minColor = settings.minColor || '#06b6d4'
  const normalColor = settings.normalColor || '#10b981'
  const maxColor = settings.maxColor || '#ef4444'

  const range = max - min === 0 ? 1 : max - min
  const pct = Math.max(0, Math.min(100, ((val - min) / range) * 100))

  let activeColor = normalColor
  let statusLabel = 'Nivel Óptimo'

  if (pct < 30) {
    activeColor = minColor
    statusLabel = 'Nivel Bajo'
  } else if (pct > 75) {
    activeColor = maxColor
    statusLabel = 'Nivel Alto'
  }

  return (
    <div className="flex flex-col justify-between h-full pt-1">
      {/* Top Value Display */}
      <div className="flex items-baseline justify-between mb-2">
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-extrabold font-mono tracking-tight" style={{ color: activeColor }}>
            {val.toFixed(2)}
          </span>
          <span className="text-xs font-bold text-slate-400 font-mono">{variable.unit}</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800">
          {isBattery ? <BatteryCharging className="w-3.5 h-3.5" style={{ color: activeColor }} /> : <Droplets className="w-3.5 h-3.5" style={{ color: activeColor }} />}
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
          <span style={{ color: activeColor }}>● {statusLabel}</span>
          <span className="text-slate-500">{min.toFixed(1)} - {max.toFixed(1)} {variable.unit}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono border-t border-slate-800/80 pt-1.5 mt-1">
        <span>Capacidad: {pct.toFixed(1)}%</span>
        <span style={{ color: activeColor }}>Estable</span>
      </div>
    </div>
  )
}
