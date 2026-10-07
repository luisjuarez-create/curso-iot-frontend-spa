import React, { useState } from 'react'
import {
  X,
  Search,
  Radio,
  Clock,
  Sparkles,
  Link2,
  ChevronRight,
  GripVertical,
  Check
} from 'lucide-react'

export function MobileVariablesDrawer({
  isOpen,
  onClose,
  variables,
  deviceId,
  onStartBinding,
}) {
  const [searchTerm, setSearchTerm] = useState('')

  if (!isOpen) return null

  const varList = Object.values(variables).filter((v) =>
    v.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleBindClick = (varName) => {
    onStartBinding(varName)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Backdrop tap to close */}
      <div className="flex-1" onClick={onClose} />

      {/* Sliding Sheet */}
      <div className="bg-slate-900 border-t border-slate-800 rounded-t-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Top Handle */}
        <div className="flex justify-center pt-3 pb-1" onClick={onClose}>
          <div className="w-12 h-1.5 rounded-full bg-slate-700 hover:bg-slate-500 cursor-pointer transition" />
        </div>

        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <h2 className="text-sm font-bold text-slate-100">Variables en Vivo</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {Object.keys(variables).length} activas
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
              Dispositivo: {deviceId}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main Variables List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filtrar variables..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {/* Empty state or items */}
          {varList.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center text-slate-500">
              <Radio className="w-8 h-8 text-emerald-400 animate-pulse mb-2" />
              <span className="text-xs font-semibold text-slate-300">Esperando datos MQTT</span>
              <span className="text-[11px] text-slate-500 mt-1 font-mono">
                devices/{deviceId}/#
              </span>
            </div>
          ) : (
            varList.map((v) => (
              <div
                key={v.name}
                className="p-3 rounded-2xl border border-slate-800 bg-slate-950/70 hover:border-slate-700 transition flex items-center justify-between gap-2.5 select-none"
              >
                <div className="min-w-0 flex-1">
                  <span
                    className="text-xs font-bold text-slate-200 block truncate"
                    title={v.name}
                  >
                    {v.name}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1 mt-0.5 whitespace-nowrap">
                    <Clock className="w-2.5 h-2.5 shrink-0" />
                    {v.lastUpdated ? v.lastUpdated.toLocaleTimeString() : 'ahora'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Live Value with truncation for long strings */}
                  <span
                    className="max-w-[100px] truncate px-2 py-1 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs font-bold text-emerald-400 text-center"
                    title={String(v.value)}
                  >
                    {typeof v.value === 'number'
                      ? Number.isInteger(v.value)
                        ? v.value
                        : v.value.toFixed(1)
                      : String(v.value).length > 12
                      ? `${String(v.value).slice(0, 11)}…`
                      : String(v.value)}
                    {v.unit && <span className="text-[10px] text-slate-400 ml-1">{v.unit}</span>}
                  </span>

                  {/* One-Tap Bind Button for Mobile */}
                  <button
                    onClick={() => handleBindClick(v.name)}
                    className="px-2.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1 transition active:scale-95 shadow-sm whitespace-nowrap"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    <span>Vincular</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 text-center text-[11px] text-slate-400">
          💡 Pulsa <span className="text-emerald-400 font-semibold">"Vincular"</span> y toca cualquier widget del lienzo para asignarla.
        </div>
      </div>
    </div>
  )
}
