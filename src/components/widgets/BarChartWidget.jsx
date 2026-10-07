import React from 'react'

export function BarChartWidget({ variable, settings = {} }) {
  if (!variable) return null

  const history = variable.history || []
  const values = history.map((h) => h.val)
  const currentVal = typeof variable.value === 'number' ? variable.value : Number(variable.value)

  const min = settings.min !== null && settings.min !== undefined ? settings.min : (values.length > 0 ? Math.min(...values) : 0)
  const max = settings.max !== null && settings.max !== undefined ? settings.max : (values.length > 0 ? Math.max(...values) : 100)
  const range = max - min === 0 ? 1 : max - min

  const minColor = settings.minColor || '#06b6d4'
  const normalColor = settings.normalColor || '#10b981'
  const maxColor = settings.maxColor || '#ef4444'

  let activeColor = normalColor
  if (settings.min !== null && currentVal < settings.min) activeColor = minColor
  else if (settings.max !== null && currentVal > settings.max) activeColor = maxColor

  return (
    <div className="flex flex-col justify-between h-full pt-1">
      {/* Stat Header */}
      <div className="flex items-baseline justify-between mb-2">
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-extrabold font-mono tracking-tight" style={{ color: activeColor }}>
            {isNaN(currentVal) ? String(variable.value) : currentVal.toFixed(2)}
          </span>
          <span className="text-xs font-bold text-slate-400 font-mono">{variable.unit}</span>
        </div>
      </div>

      {/* Bar Chart Area */}
      <div className="h-28 my-auto bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex items-end gap-1.5 justify-between">
        {history.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-[11px] text-slate-500 font-mono">
            Esperando lecturas...
          </div>
        ) : (
          history.slice(-16).map((item, idx, arr) => {
            const clamped = Math.max(min, Math.min(max, item.val))
            const heightPct = Math.max(12, Math.min(100, ((clamped - min) / range) * 100))
            const isLast = idx === arr.length - 1

            let barColor = normalColor
            if (settings.min !== null && item.val < settings.min) barColor = minColor
            else if (settings.max !== null && item.val > settings.max) barColor = maxColor

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative h-full justify-end">
                <div className="absolute -top-6 hidden group-hover:block bg-slate-800 border border-slate-700 text-[10px] font-mono text-white px-1.5 py-0.5 rounded whitespace-nowrap z-10 shadow-lg">
                  {item.val.toFixed(1)} {variable.unit}
                </div>

                <div
                  className={`w-full rounded-t-md transition-all duration-300 ${isLast ? 'shadow-sm' : 'opacity-80 hover:opacity-100'}`}
                  style={{
                    height: `${heightPct}%`,
                    backgroundColor: barColor,
                  }}
                />
              </div>
            )
          })
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono border-t border-slate-800/80 pt-1.5 mt-1">
        <span style={{ color: minColor }}>Mín: {min.toFixed(1)}</span>
        <span style={{ color: activeColor }}>● 16 muestras</span>
        <span style={{ color: maxColor }}>Máx: {max.toFixed(1)}</span>
      </div>
    </div>
  )
}
