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
  widgets,
  onBindVariableToWidget,
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedVarForBinding, setSelectedVarForBinding] = useState(null)

  if (!isOpen) return null

  const varList = Object.values(variables).filter((v) =>
    v.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelectWidget = (widgetId) => {
    if (selectedVarForBinding) {
      onBindVariableToWidget(widgetId, selectedVarForBinding.name)
      setSelectedVarForBinding(null)
      onClose()
    }
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
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
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

        {/* Sub-view: Widget Selector if a variable was tapped for binding */}
        {selectedVarForBinding ? (
          <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-slate-950/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-emerald-400" />
                Vincular <span className="font-mono text-emerald-400">{selectedVarForBinding.name}</span> a:
              </span>
              <button
                onClick={() => setSelectedVarForBinding(null)}
                className="text-[11px] text-slate-400 hover:text-white"
              >
                Volver
              </button>
            </div>

            {widgets.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">
                No tienes widgets en el lienzo. Primero agrega uno con "+ Widget".
              </p>
            ) : (
              <div className="space-y-2">
                {widgets.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => handleSelectWidget(w.id)}
                    className="w-full p-3 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 hover:border-emerald-500/50 text-left transition flex items-center justify-between group"
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-200 group-hover:text-emerald-300 block">
                        {w.title || 'Widget'}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {w.variableKey ? `Actualmente: ${w.variableKey}` : 'Sin variable asignada'}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Main Variables List */
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
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
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', v.name)
                    e.dataTransfer.setData('drag-type', 'variable')
                  }}
                  className="p-3.5 rounded-2xl border border-slate-800 bg-slate-950/70 hover:border-slate-700 transition flex items-center justify-between gap-3 select-none"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <GripVertical className="w-4 h-4 text-slate-600 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-200 block truncate">
                        {v.name}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        {v.lastUpdated ? v.lastUpdated.toLocaleTimeString() : 'ahora'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Live Value */}
                    <span className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs font-bold text-emerald-400">
                      {typeof v.value === 'number'
                        ? Number.isInteger(v.value)
                          ? v.value
                          : v.value.toFixed(1)
                        : String(v.value)}
                      {v.unit && <span className="text-[10px] text-slate-400 ml-1">{v.unit}</span>}
                    </span>

                    {/* Quick Bind Button for Mobile Touch */}
                    <button
                      onClick={() => setSelectedVarForBinding(v)}
                      className="px-2.5 py-1 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1 transition"
                    >
                      <Link2 className="w-3 h-3" />
                      <span>Vincular</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 text-center text-[11px] text-slate-500">
          💡 En móvil pulsa <span className="text-emerald-400 font-semibold">"Vincular"</span> para asignar la variable con 1 toque.
        </div>
      </div>
    </div>
  )
}
