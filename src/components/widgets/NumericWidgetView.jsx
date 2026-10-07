import React from 'react'

export function NumericWidgetView({ variable }) {
  if (!variable) return null

  return (
    <div className="my-auto py-2">
      <div className="flex items-baseline gap-2">
        <span className="text-4xl md:text-5xl font-extrabold font-mono text-slate-100 tracking-tight">
          {typeof variable.value === 'number'
            ? Number.isInteger(variable.value)
              ? variable.value
              : variable.value.toFixed(2)
            : String(variable.value)}
        </span>
        {variable.unit && (
          <span className="text-lg md:text-xl font-bold text-slate-400">
            {variable.unit}
          </span>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span className="text-slate-500">
          Último: {variable.lastUpdated ? variable.lastUpdated.toLocaleTimeString() : 'reciente'}
        </span>
        {variable.min !== null && variable.max !== null && (
          <div className="flex items-center gap-2 bg-slate-950/80 px-2 py-0.5 rounded-lg border border-slate-800">
            <span className="text-cyan-400 font-medium">↓ {variable.min.toFixed(1)}</span>
            <span className="text-slate-600">|</span>
            <span className="text-rose-400 font-medium">↑ {variable.max.toFixed(1)}</span>
          </div>
        )}
      </div>
    </div>
  )
}
