import React, { useEffect, useState } from 'react'
import { Power } from 'lucide-react'

const CONFIRM_TIMEOUT_MS = 6000

function toBool(value) {
  return value === true || value === 1 || value === 'true' || value === 'ON' || value === 'on'
}

export function SwitchWidget({ commandKey, reported, enabled, onSend }) {
  const hasReport = reported !== undefined
  const reportedOn = toBool(reported)
  const [pending, setPending] = useState(null) // valor enviado que el dispositivo aún no confirma
  const [unconfirmed, setUnconfirmed] = useState(false)

  useEffect(() => {
    if (pending !== null && reportedOn === pending) setPending(null)
  }, [reportedOn, pending])

  useEffect(() => {
    if (pending === null) return undefined
    const t = setTimeout(() => {
      setPending(null)
      setUnconfirmed(true)
    }, CONFIRM_TIMEOUT_MS)
    return () => clearTimeout(t)
  }, [pending])

  const isOn = pending ?? reportedOn

  const toggle = () => {
    const next = !isOn
    if (onSend({ [commandKey]: next })) {
      setPending(next)
      setUnconfirmed(false)
    }
  }

  let statusText = 'Sin estado reportado'
  let statusClass = 'text-slate-500'
  if (!enabled) {
    statusText = 'Sin conexión al broker'
    statusClass = 'text-rose-400'
  } else if (pending !== null) {
    statusText = 'Enviado, esperando confirmación…'
    statusClass = 'text-cyan-400'
  } else if (unconfirmed) {
    statusText = 'El dispositivo no confirmó'
    statusClass = 'text-amber-400'
  } else if (hasReport) {
    statusText = 'Confirmado por el dispositivo'
    statusClass = 'text-emerald-400'
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2.5 py-1">
      <button
        onClick={toggle}
        disabled={!enabled}
        role="switch"
        aria-checked={isOn}
        className={`relative w-24 h-12 rounded-full border-2 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${
          isOn ? 'bg-emerald-500/25 border-emerald-400' : 'bg-slate-800 border-slate-600'
        } ${pending !== null ? 'animate-pulse' : ''}`}
      >
        <span
          className={`absolute top-1 w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 ${
            isOn ? 'left-[calc(100%-2.5rem)] bg-emerald-400 text-slate-950 shadow-emerald-500/40' : 'left-1 bg-slate-400 text-slate-800'
          }`}
        >
          <Power className="w-4 h-4 stroke-[2.5]" />
        </span>
      </button>
      <div className="text-center">
        <span className={`block text-lg font-bold font-mono ${isOn ? 'text-emerald-300' : 'text-slate-400'}`}>
          {isOn ? 'ON' : 'OFF'}
        </span>
        <span className={`block text-[10px] ${statusClass}`}>{statusText}</span>
        <span className="block text-[10px] font-mono text-slate-600 mt-0.5">{`{"${commandKey}": ${!isOn}}`} al pulsar</span>
      </div>
    </div>
  )
}
