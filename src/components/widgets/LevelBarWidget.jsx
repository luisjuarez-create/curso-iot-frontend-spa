import React from 'react'
import { BatteryCharging, Droplets, Zap } from 'lucide-react'

export function LevelBarWidget({ variable }) {
  if (!variable) return null

  const val = typeof variable.value === 'number' ? variable.value : Number(variable.value) || 0
  const isBattery = variable.name.toLowerCase().includes('bat') || variable.name.toLowerCase().includes('volt')
  
  // Normalization logic
  let min = 0
  let max = 100

  if (isBattery) {
    min = 3.0
    max = 4.2
  } else if (variable.min !== null && variable.max !== null && variable.max > variable.min) {
    min = Math.min(0, variable.min)
    max = variable.max
  }

  const range = max - min === 0 ? 1 : max - min
  const pct = Math.max(0, Math.min(100, ((val - min) / range) * 100))

  const getColor = (p) => {
    if (isBattery) {
      if (p < 20) return { bg: 'bg-rose-500', text: 'text-rose-400', label: 'Batería Crítica' }
      if (p < 50) return { bg: 'bg-amber-500', text: 'text-amber-400', label: 'Batería Media' }
      return { bg: 'bg-emerald-500', text: 'text-emerald-400', label: 'Batería Óptima' }
    }
    if (p < 30) return { bg: 'bg-cyan-500', text: 'text-cyan-400', label: 'Nivel Bajo' }
    if (p < 75) return { bg: 'bg-emerald-500', text: 'text-emerald-400', label: 'Nivel Normal' }
    return { bg: 'bg-amber-500', text: 'text-amber-400', label: 'Nivel Alto' }
  }

  const colorStyle = getColor(pct)

  return (
    <div className="flex flex-col justify-between h-full pt-1">
      {/* Top Value Display */}
      <div className="flex items-baseline justify-between mb-2">
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-extrabold font-mono text-slate-100">
            {val.toFixed(2)}
          </span>
          <span className="text-xs font-bold text-slate-400 font-mono">{variable.unit}</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800">
          {isBattery ? <BatteryCharging className="w-3.5 h-3.5 text-amber-400" /> : <Droplets className="w-3.5 h-3.5 text-cyan-400" />}
          <span className={colorStyle.text}>{pct.toFixed(0)}%</span>
        </div>
      </div>

      {/* Level / Progress Bar */}
      <div className="my-auto py-2">
        <div className="w-full h-6 bg-slate-950 rounded-xl border border-slate-800 p-1 overflow-hidden relative shadow-inner">
          {/* Animated striped bar */}
          <div
            className={`h-full rounded-lg transition-all duration-500 ease-out ${colorStyle.bg} shadow-md`}
            style={{ width: `${pct}%` }}
          />

          {/* Segment Tick Marks */}
          <div className="absolute inset-0 flex justify-between px-3 items-center pointer-events-none opacity-20">
            <div className="w-px h-3 bg-white" />
            <div className="w-px h-3 bg-white" />
            <div className="w-px h-3 bg-white" />
          </div>
        </div>

        {/* Status Text */}
        <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span className={colorStyle.text}>● {colorStyle.label}</span>
          <span className="text-slate-500">{min.toFixed(1)} - {max.toFixed(1)} {variable.unit}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono border-t border-slate-800/80 pt-1.5 mt-1">
        <span>Capacidad: {pct.toFixed(1)}%</span>
        <span className="text-emerald-400">Estable</span>
      </div>
    </div>
  )
}
