import React from 'react'

export function BarChartWidget({ variable }) {
  if (!variable) return null

  const history = variable.history || []
  const values = history.map((h) => h.val)
  const currentVal = typeof variable.value === 'number' ? variable.value : Number(variable.value)

  const minVal = values.length > 0 ? Math.min(...values) : 0
  const maxVal = values.length > 0 ? Math.max(...values) : 100
  const range = maxVal - minVal === 0 ? 1 : maxVal - minVal

  return (
    <div className="flex flex-col justify-between h-full pt-1">
      {/* Stat Header */}
      <div className="flex items-baseline justify-between mb-2">
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-extrabold font-mono text-slate-100">
            {isNaN(currentVal) ? String(variable.value) : currentVal.toFixed(2)}
          </span>
          <span className="text-xs font-bold text-teal-400 font-mono">{variable.unit}</span>
        </div>
        <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
          Barras Históricas
        </span>
      </div>

      {/* Bar Chart Area */}
      <div className="h-28 my-auto bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex items-end gap-1.5 justify-between">
        {history.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-[11px] text-slate-500 font-mono">
            Esperando lecturas...
          </div>
        ) : (
          history.slice(-16).map((item, idx, arr) => {
            const heightPct = Math.max(12, Math.min(100, ((item.val - minVal) / range) * 100))
            const isLast = idx === arr.length - 1

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative h-full justify-end">
                {/* Tooltip on hover */}
                <div className="absolute -top-6 hidden group-hover:block bg-slate-800 border border-slate-700 text-[10px] font-mono text-white px-1.5 py-0.5 rounded whitespace-nowrap z-10 shadow-lg">
                  {item.val.toFixed(1)} {variable.unit}
                </div>

                {/* The vertical bar */}
                <div
                  className={`w-full rounded-t-md transition-all duration-300 ${
                    isLast
                      ? 'bg-gradient-to-t from-teal-500 to-emerald-400 shadow-sm shadow-emerald-500/30'
                      : 'bg-slate-800 hover:bg-slate-700'
                  }`}
                  style={{ height: `${heightPct}%` }}
                />
              </div>
            )
          })
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono border-t border-slate-800/80 pt-1.5 mt-1">
        <span>Mín: {minVal.toFixed(1)}</span>
        <span className="text-teal-400">● 16 muestras</span>
        <span>Máx: {maxVal.toFixed(1)}</span>
      </div>
    </div>
  )
}
