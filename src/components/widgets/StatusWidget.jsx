import React from 'react'
import { ShieldCheck, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react'

export function StatusWidget({ variable }) {
  if (!variable) return null

  const rawVal = variable.value
  const numVal = typeof rawVal === 'number' ? rawVal : Number(rawVal)
  const isNumeric = !isNaN(numVal)

  // Logic to determine status
  let status = 'NORMAL'
  let color = 'emerald'
  let message = 'Operación en rango normal'

  if (typeof rawVal === 'string') {
    const upper = rawVal.toUpperCase()
    if (upper.includes('ALERT') || upper.includes('CRIT') || upper.includes('ERROR') || upper.includes('FAIL')) {
      status = 'ALERTA CRÍTICA'
      color = 'rose'
      message = `Evento reportado: ${rawVal}`
    } else if (upper.includes('WARN') || upper.includes('HIGH') || upper.includes('LOW')) {
      status = 'ADVERTENCIA'
      color = 'amber'
      message = `Condición: ${rawVal}`
    } else {
      status = upper
      color = 'emerald'
      message = 'Dispositivo respondiendo'
    }
  } else if (isNumeric) {
    // Dynamic rule based on variable name
    const lowerName = variable.name.toLowerCase()
    if (lowerName.includes('temp')) {
      if (numVal > 26) {
        status = 'TEMPERATURA ALTA'
        color = 'rose'
        message = `Umbral excedido: ${numVal.toFixed(1)}°C > 26°C`
      } else if (numVal < 10) {
        status = 'TEMPERATURA BAJA'
        color = 'cyan'
        message = `Frío extremo detectado: ${numVal.toFixed(1)}°C`
      }
    } else if (lowerName.includes('bat')) {
      if (numVal < 3.75) {
        status = 'BATERÍA BAJA'
        color = 'amber'
        message = 'Conectar a recarga pronto'
      }
    }
  }

  const colorsMap = {
    emerald: {
      badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      dot: 'bg-emerald-400 shadow-emerald-500/50',
      icon: CheckCircle2,
      text: 'text-emerald-400',
    },
    amber: {
      badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      dot: 'bg-amber-400 shadow-amber-500/50',
      icon: AlertTriangle,
      text: 'text-amber-400',
    },
    rose: {
      badge: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
      dot: 'bg-rose-400 shadow-rose-500/50',
      icon: AlertCircle,
      text: 'text-rose-400',
    },
    cyan: {
      badge: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
      dot: 'bg-cyan-400 shadow-cyan-500/50',
      icon: ShieldCheck,
      text: 'text-cyan-400',
    },
  }

  const theme = colorsMap[color] || colorsMap.emerald
  const Icon = theme.icon

  return (
    <div className="flex flex-col justify-between h-full pt-1">
      {/* Top Banner Status */}
      <div className="flex items-center justify-between mb-2">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border ${theme.badge}`}>
          <span className={`w-2.5 h-2.5 rounded-full ${theme.dot} animate-pulse shadow-md`} />
          {status}
        </span>
        <span className="text-[10px] font-mono text-slate-500">Supervisión</span>
      </div>

      {/* Main Content Area */}
      <div className="my-auto py-2 flex items-center gap-3">
        <div className={`p-3 rounded-2xl bg-slate-950 border border-slate-800 ${theme.text} shadow-inner`}>
          <Icon className="w-7 h-7" />
        </div>
        <div>
          <span className="text-xl font-bold font-mono text-slate-100 block">
            {isNumeric ? `${numVal.toFixed(2)} ${variable.unit}` : String(rawVal)}
          </span>
          <p className="text-xs text-slate-400 mt-0.5 leading-snug">{message}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono border-t border-slate-800/80 pt-1.5 mt-1">
        <span>Última evaluación: {variable.lastUpdated ? variable.lastUpdated.toLocaleTimeString() : 'Ahora'}</span>
        <span className={theme.text}>● Activo</span>
      </div>
    </div>
  )
}
