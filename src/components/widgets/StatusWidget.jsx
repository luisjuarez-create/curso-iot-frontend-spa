import React from 'react'
import { ShieldCheck } from 'lucide-react'
import { isSet, getColors, formatNumber } from '../../lib/widgetSettings.js'

export function StatusWidget({ variable, settings = {} }) {
  if (!variable) return null

  const rawVal = variable.value
  const numVal = typeof rawVal === 'number' ? rawVal : Number(rawVal)
  const isNumeric = !isNaN(numVal)

  const min = isSet(settings.min) ? Number(settings.min) : null
  const max = isSet(settings.max) ? Number(settings.max) : null
  const unit = settings.unit || ''
  const withUnit = (n) => (unit ? `${formatNumber(n)} ${unit}` : formatNumber(n))

  const { minColor, normalColor, maxColor } = getColors(settings)

  let status = 'NORMAL'
  let activeColor = normalColor
  let message = 'Operación en rango normal'

  if (isNumeric && (min !== null || max !== null)) {
    if (min !== null && numVal < min) {
      status = 'VALOR BAJO'
      activeColor = minColor
      message = `Lectura ${withUnit(numVal)} inferior a la alerta baja (${withUnit(min)})`
    } else if (max !== null && numVal > max) {
      status = 'ALERTA MÁXIMA'
      activeColor = maxColor
      message = `Lectura ${withUnit(numVal)} superior a la alerta alta (${withUnit(max)})`
    } else {
      status = 'DENTRO DE RANGO'
      activeColor = normalColor
      message = `Valor dentro de intervalo seguro (${min !== null ? withUnit(min) : '-'} a ${max !== null ? withUnit(max) : '-'})`
    }
  } else if (typeof rawVal === 'string') {
    const upper = rawVal.toUpperCase()
    if (upper.includes('ALERT') || upper.includes('CRIT') || upper.includes('ERROR') || upper.includes('FAIL')) {
      status = 'ALERTA CRÍTICA'
      activeColor = maxColor
      message = `Evento reportado: ${rawVal}`
    } else if (upper.includes('WARN') || upper.includes('HIGH') || upper.includes('LOW')) {
      status = 'ADVERTENCIA'
      activeColor = minColor
      message = `Condición: ${rawVal}`
    } else {
      status = upper
      activeColor = normalColor
      message = 'Dispositivo respondiendo'
    }
  }

  return (
    <div className="flex flex-col justify-between h-full pt-1">
      {/* Top Banner Status */}
      <div className="flex items-center justify-between mb-2">
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border"
          style={{
            backgroundColor: `${activeColor}15`,
            borderColor: `${activeColor}40`,
            color: activeColor,
          }}
        >
          <span
            className="w-2.5 h-2.5 rounded-full animate-pulse shadow-md"
            style={{ backgroundColor: activeColor }}
          />
          {status}
        </span>
        <span className="text-[10px] font-mono text-slate-500">Supervisión</span>
      </div>

      {/* Main Content Area */}
      <div className="my-auto py-2 flex items-center gap-3">
        <div
          className="p-3 rounded-2xl bg-slate-950 border border-slate-800 shadow-inner"
          style={{ color: activeColor }}
        >
          <ShieldCheck className="w-7 h-7" />
        </div>
        <div>
          <span className="text-xl font-bold font-mono text-slate-100 block">
            {isNumeric ? withUnit(numVal) : String(rawVal)}
          </span>
          <p className="text-xs text-slate-400 mt-0.5 leading-snug">{message}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono border-t border-slate-800/80 pt-1.5 mt-1">
        <span>Última evaluación: {variable.lastUpdated ? variable.lastUpdated.toLocaleTimeString() : 'Ahora'}</span>
        <span style={{ color: activeColor }}>● Activo</span>
      </div>
    </div>
  )
}
