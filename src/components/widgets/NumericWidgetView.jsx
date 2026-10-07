import React from 'react'

export function NumericWidgetView({ variable, settings = {} }) {
  if (!variable) return null

  const val = typeof variable.value === 'number' ? variable.value : Number(variable.value)
  const isNumeric = !isNaN(val)

  const min = settings.min !== null && settings.min !== undefined ? settings.min : variable.min
  const max = settings.max !== null && settings.max !== undefined ? settings.max : variable.max

  // Dynamic color according to thresholds
  const minColor = settings.minColor || '#06b6d4'
  const normalColor = settings.normalColor || '#10b981'
  const maxColor = settings.maxColor || '#ef4444'

  let valueColor = '#f8fafc' // Slate 50
  if (isNumeric) {
    if (min !== null && val < min) valueColor = minColor
    else if (max !== null && val > max) valueColor = maxColor
    else if (min !== null || max !== null) valueColor = normalColor
  }

  return (
    <div className="flex flex-col justify-between h-full pt-1">
      <div className="my-auto py-1">
        <div className="flex items-baseline gap-2">
          <span
            className="text-4xl md:text-5xl font-extrabold font-mono tracking-tight transition-colors duration-300"
            style={{ color: valueColor }}
          >
            {isNumeric
              ? Number.isInteger(val)
                ? val
                : val.toFixed(2)
              : String(variable.value)}
          </span>
          {variable.unit && (
            <span className="text-lg md:text-xl font-bold text-slate-400 font-mono">
              {variable.unit}
            </span>
          )}
        </div>
      </div>

      {/* Footer de una sola fila sin ocupar espacio de más */}
      <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono border-t border-slate-800/80 pt-1.5 mt-1">
        <span className="whitespace-nowrap">
          {variable.lastUpdated ? variable.lastUpdated.toLocaleTimeString() : 'En vivo'}
        </span>
        {(min !== null || max !== null) && (
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            {min !== null && <span style={{ color: minColor }}>↓ {min.toFixed(0)}</span>}
            {min !== null && max !== null && <span className="text-slate-700">|</span>}
            {max !== null && <span style={{ color: maxColor }}>↑ {max.toFixed(0)}</span>}
          </div>
        )}
      </div>
    </div>
  )
}
