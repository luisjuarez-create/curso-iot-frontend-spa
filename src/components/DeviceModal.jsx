import React, { useState } from 'react'
import { Cpu, Check, HelpCircle, X } from 'lucide-react'

export function DeviceModal({
  isOpen,
  currentDeviceId,
  currentBrokerUrl,
  onSave,
  onClose,
  canClose = true
}) {
  const [deviceId, setDeviceId] = useState(currentDeviceId || '002130123')

  if (!isOpen) return null

  const presets = [
    { id: '002130123', label: 'Laboratorio A' },
    { id: '002130124', label: 'Cámara Fría' },
    { id: '002130125', label: 'Invernadero' },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!deviceId.trim()) return
    onSave({
      deviceId: deviceId.trim(),
      brokerUrl: currentBrokerUrl
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Seleccionar Dispositivo IoT</h2>
              <p className="text-xs text-slate-400">Ingresa el ID del equipo para suscribirse a sus datos</p>
            </div>
          </div>
          {canClose && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Device ID Input */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              ID del Dispositivo (Serial / Identificador)
            </label>
            <input
              type="text"
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
              placeholder="Ej. 002130123"
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
            />
            <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              Se escuchará el tópico: <span className="font-mono text-emerald-400 font-semibold">devices/{deviceId || '{id}'}/#</span>
            </p>
          </div>

          {/* Quick Presets */}
          <div>
            <span className="block text-[11px] font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
              Dispositivos de Prueba Disponibles:
            </span>
            <div className="grid grid-cols-3 gap-2">
              {presets.map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => setDeviceId(p.id)}
                  className={`px-2.5 py-2 rounded-xl text-left border transition text-xs flex flex-col gap-0.5 ${
                    deviceId === p.id
                      ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="font-mono font-bold">{p.id}</span>
                  <span className="text-[10px] text-slate-400 truncate">{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-semibold text-sm py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              Conectar y Ver Variables
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
