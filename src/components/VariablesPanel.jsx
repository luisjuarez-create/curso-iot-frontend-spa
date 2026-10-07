import React, { useState } from 'react'
import { GripVertical, Search, Radio, Clock, Sparkles } from 'lucide-react'

export function VariablesPanel({ variables, deviceId, status }) {
  const [searchTerm, setSearchTerm] = useState('')

  const varList = Object.values(variables).filter((v) =>
    v.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDragStart = (e, variableKey) => {
    e.dataTransfer.setData('text/plain', variableKey)
    e.dataTransfer.effectAllowed = 'copyMove'
  }

  return (
    <aside className="w-full lg:w-[30%] min-w-[300px] border-r border-slate-800 bg-slate-900/60 backdrop-blur flex flex-col h-[calc(100vh-4rem)]">
      {/* Panel Header */}
      <div className="p-4 border-b border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
            <h2 className="text-sm font-bold text-slate-100 tracking-tight">Variables del Dispositivo</h2>
          </div>
          <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {Object.keys(variables).length} activas
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-snug">
          Arrastra cualquier variable al lienzo o a un widget para vincular sus datos en tiempo real.
        </p>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Filtrar variables..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/70 transition"
          />
        </div>
      </div>

      {/* Variables List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {varList.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-emerald-400 mb-3 relative">
              <Radio className="w-6 h-6 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping"></span>
            </div>
            <h3 className="text-xs font-semibold text-slate-200">Esperando datos de telemetría</h3>
            <p className="text-[11px] text-slate-400 mt-1 max-w-[220px]">
              Escuchando en <span className="font-mono text-emerald-400">devices/{deviceId}/#</span>
            </p>
            <div className="mt-4 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[10px] text-slate-400 text-left font-mono">
              💡 Tip: Ejecuta el simulador local:
              <span className="block text-emerald-400 mt-0.5">
                python clients/multi_device_publisher.py
              </span>
            </div>
          </div>
        ) : (
          varList.map((v) => (
            <div
              key={v.name}
              draggable
              onDragStart={(e) => handleDragStart(e, v.name)}
              className="group p-3 rounded-xl border border-slate-800 bg-slate-800/40 hover:bg-slate-800/80 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/5 transition cursor-grab active:cursor-grabbing select-none"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <GripVertical className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 shrink-0 transition" />
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-emerald-300 transition block truncate">
                      {v.name}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-2.5 h-2.5 text-slate-500" />
                      {v.lastUpdated ? v.lastUpdated.toLocaleTimeString() : 'reciente'}
                    </span>
                  </div>
                </div>

                {/* Current Value Badge */}
                <div className="text-right shrink-0">
                  <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700/80 font-mono text-xs font-bold text-emerald-400 shadow-inner">
                    {typeof v.value === 'number'
                      ? Number.isInteger(v.value)
                        ? v.value
                        : v.value.toFixed(2)
                      : String(v.value)}
                    {v.unit && <span className="text-[10px] text-slate-400 ml-1">{v.unit}</span>}
                  </span>
                </div>
              </div>

              {/* Min/Max stats bar if numeric */}
              {v.min !== null && v.max !== null && (
                <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Mín: {v.min.toFixed(1)}</span>
                  <span className="text-slate-400">|</span>
                  <span>Máx: {v.max.toFixed(1)}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-[11px] text-slate-400 flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>Arrastra una tarjeta hacia la derecha para conectarla.</span>
      </div>
    </aside>
  )
}
