import React, { useState } from 'react'
import { GripVertical, Search, Radio, Clock, Sparkles } from 'lucide-react'

export function VariablesPanel({ variables, deviceId }) {
  const [searchTerm, setSearchTerm] = useState('')

  const varList = Object.values(variables).filter((v) =>
    v.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDragStart = (e, variableKey) => {
    e.dataTransfer.setData('text/plain', variableKey)
    e.dataTransfer.setData('drag-type', 'variable')
    e.dataTransfer.effectAllowed = 'copy'
  }

  return (
    <aside className="w-full lg:w-[20%] min-w-[210px] max-w-[270px] border-r border-slate-800 bg-slate-900/60 backdrop-blur flex flex-col h-[calc(100vh-4rem)]">
      {/* Panel Header */}
      <div className="p-3 border-b border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
            <h2 className="text-xs font-bold text-slate-100 tracking-tight truncate">Variables IoT</h2>
          </div>
          <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {Object.keys(variables).length}
          </span>
        </div>

        <p className="text-[11px] text-slate-400 leading-tight">
          Arrastra hacia los widgets a la derecha.
        </p>

        {/* Search */}
        <div className="relative">
          <Search className="w-3 h-3 text-slate-500 absolute left-2.5 top-2" />
          <input
            type="text"
            placeholder="Buscar variable..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-7 pr-2.5 py-1 text-[11px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/70 transition"
          />
        </div>
      </div>

      {/* Variables List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {varList.length === 0 ? (
          <div className="h-56 flex flex-col items-center justify-center text-center p-3 text-slate-400">
            <div className="w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-emerald-400 mb-2 relative">
              <Radio className="w-4 h-4 animate-pulse" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
            </div>
            <h3 className="text-[11px] font-semibold text-slate-200">Esperando datos</h3>
            <p className="text-[10px] text-slate-500 mt-1 truncate max-w-full font-mono">
              devices/{deviceId}/#
            </p>
          </div>
        ) : (
          varList.map((v) => (
            <div
              key={v.name}
              draggable
              onDragStart={(e) => handleDragStart(e, v.name)}
              className="group p-2.5 rounded-xl border border-slate-800 bg-slate-800/40 hover:bg-slate-800/80 hover:border-emerald-500/50 hover:shadow-md hover:shadow-emerald-500/5 transition cursor-grab active:cursor-grabbing select-none"
            >
              <div className="flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <GripVertical className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 shrink-0 transition" />
                  <div className="min-w-0">
                    <span className="text-[11px] font-semibold text-slate-200 group-hover:text-emerald-300 transition block truncate">
                      {v.name}
                    </span>
                    <span className="text-[9px] text-slate-500 flex items-center gap-1 font-mono">
                      <Clock className="w-2 h-2" />
                      {v.lastUpdated ? v.lastUpdated.toLocaleTimeString() : 'ahora'}
                    </span>
                  </div>
                </div>

                {/* Current Value Pill */}
                <div className="text-right shrink-0">
                  <span className="inline-block px-1.5 py-0.5 rounded-md bg-slate-950 border border-slate-800 font-mono text-[11px] font-bold text-emerald-400">
                    {typeof v.value === 'number'
                      ? Number.isInteger(v.value)
                        ? v.value
                        : v.value.toFixed(1)
                      : String(v.value)}
                    {v.unit && <span className="text-[9px] text-slate-400 ml-0.5">{v.unit}</span>}
                  </span>
                </div>
              </div>

              {/* Min/Max summary */}
              {v.min !== null && v.max !== null && (
                <div className="mt-1.5 pt-1.5 border-t border-slate-800/60 flex items-center justify-between text-[9px] text-slate-500 font-mono">
                  <span>↓ {v.min.toFixed(1)}</span>
                  <span>↑ {v.max.toFixed(1)}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer Info */}
      <div className="p-2 border-t border-slate-800 bg-slate-950/60 text-[10px] text-slate-500 flex items-center gap-1.5">
        <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
        <span className="truncate">Arrastra a un widget para conectar.</span>
      </div>
    </aside>
  )
}
