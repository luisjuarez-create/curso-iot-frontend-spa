import React, { useState } from 'react'
import { Send } from 'lucide-react'

const HEX_COLOR = /^#[0-9a-f]{6}$/i

const PRESETS = [
  { hex: '#ff0000', label: 'Rojo' },
  { hex: '#00ff00', label: 'Verde' },
  { hex: '#0000ff', label: 'Azul' },
  { hex: '#ffffff', label: 'Blanco' },
  { hex: '#000000', label: 'Apagado' },
]

function toRgb(hex) {
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
}

export function ColorCommandWidget({ commandKey, reported, enabled, onSend }) {
  const reportedHex = typeof reported === 'string' && HEX_COLOR.test(reported) ? reported.toLowerCase() : null
  const [color, setColor] = useState(reportedHex || '#10b981')
  const [sent, setSent] = useState(null)

  const send = () => {
    if (onSend({ [commandKey]: color })) setSent(color)
  }

  const [r, g, b] = toRgb(color)

  let statusText = reportedHex ? 'Color actual en el dispositivo' : 'Sin color reportado'
  let statusClass = 'text-slate-500'
  if (!enabled) {
    statusText = 'Sin conexión al broker'
    statusClass = 'text-rose-400'
  } else if (sent && sent !== reportedHex) {
    statusText = 'Enviado, esperando confirmación…'
    statusClass = 'text-cyan-400'
  } else if (sent && sent === reportedHex) {
    statusText = 'Aplicado en el dispositivo'
    statusClass = 'text-emerald-400'
  }

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-3">
        <label
          className="relative w-14 h-14 rounded-xl border-2 border-slate-600 hover:border-slate-400 cursor-pointer shrink-0 shadow-inner transition"
          style={{ backgroundColor: color }}
          title="Elegir color"
        >
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </label>
        <div className="min-w-0 flex-1">
          <span className="block font-mono text-base font-bold text-slate-100 uppercase">{color}</span>
          <span className="block font-mono text-[11px] text-slate-400">
            R {r} · G {g} · B {b}
          </span>
          <div className="flex gap-1 mt-1.5">
            {PRESETS.map((p) => (
              <button
                key={p.hex}
                onClick={() => setColor(p.hex)}
                title={p.label}
                className={`w-5 h-5 rounded-md border transition hover:scale-110 ${
                  color === p.hex ? 'border-white ring-1 ring-white/60' : 'border-slate-600'
                }`}
                style={{ backgroundColor: p.hex }}
              />
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={send}
        disabled={!enabled}
        className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 active:scale-95 transition disabled:opacity-40 disabled:pointer-events-none"
      >
        <Send className="w-3.5 h-3.5" />
        Enviar color
      </button>

      <div className="flex items-center justify-center gap-1.5 text-[10px]">
        {reportedHex && <span className="w-3 h-3 rounded border border-slate-600" style={{ backgroundColor: reportedHex }} />}
        <span className={statusClass}>
          {statusText}
          {reportedHex && !sent && <span className="font-mono text-slate-400"> {reportedHex}</span>}
        </span>
      </div>
    </div>
  )
}
