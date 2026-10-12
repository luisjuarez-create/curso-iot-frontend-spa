import React from 'react'
import { isSet, getColors, getZone, zoneColor, formatNumber } from '../../lib/widgetSettings.js'

export function NumericWidgetView({ variable, settings = {} }) {
  if (!variable) return null

  const val = typeof variable.value === 'number' ? variable.value : Number(variable.value)
  const isNumeric = !isNaN(val)

  const unit = settings.unit || ''
  const hasLow = isSet(settings.min)
  const hasHigh = isSet(settings.max)

  const colors = getColors(settings)
  const zone = isNumeric ? getZone(val, settings) : null
  const valueColor = zone ? zoneColor(zone, colors) : '#f8fafc'

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
          {unit && (
            <span className="text-lg md:text-xl font-bold text-slate-400 font-mono">
              {unit}
            </span>
          )}
        </div>
      </div>

      {/* Footer de una sola fila sin ocupar espacio de más */}
      <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono border-t border-slate-800/80 pt-1.5 mt-1">
        <span className="whitespace-nowrap">
          {variable.lastUpdated ? variable.lastUpdated.toLocaleTimeString() : 'En vivo'}
        </span>
        {(hasLow || hasHigh) && (
          <div className="flex items-center gap-1.5 whitespace-nowrap" title="Umbrales de alerta">
            {hasLow && <span style={{ color: colors.minColor }}>↓ {formatNumber(settings.min)}</span>}
            {hasLow && hasHigh && <span className="text-slate-700">|</span>}
            {hasHigh && <span style={{ color: colors.maxColor }}>↑ {formatNumber(settings.max)}</span>}
          </div>
        )}
      </div>
    </div>
  )
}
