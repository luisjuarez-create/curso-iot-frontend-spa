import React, { useState } from 'react'
import {
  Hash,
  Trash2,
  Maximize2,
  Unlink,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Sparkles
} from 'lucide-react'

export function NumericWidget({
  widget,
  variables,
  onUpdateWidget,
  onDeleteWidget,
}) {
  const [isDragOver, setIsDragOver] = useState(false)

  const linkedVar = widget.variableKey ? variables[widget.variableKey] : null

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const varKey = e.dataTransfer.getData('text/plain')
    if (varKey) {
      onUpdateWidget(widget.id, {
        variableKey: varKey,
        title: widget.title || varKey.toUpperCase(),
      })
    }
  }

  const cycleColSpan = () => {
    // Ciclo de columnas en el grid: 1 -> 2 -> 3 -> 4 -> 1
    const nextCols = widget.colSpan >= 4 ? 1 : widget.colSpan + 1
    onUpdateWidget(widget.id, { colSpan: nextCols })
  }

  // Generar clases para span en Tailwind grid
  const getColSpanClass = () => {
    switch (widget.colSpan) {
      case 2:
        return 'col-span-1 md:col-span-2'
      case 3:
        return 'col-span-1 md:col-span-2 lg:col-span-3'
      case 4:
        return 'col-span-1 md:col-span-2 lg:col-span-4'
      default:
        return 'col-span-1'
    }
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`rounded-2xl border transition-all duration-200 relative overflow-hidden flex flex-col justify-between p-5 select-none ${getColSpanClass()} ${
        isDragOver
          ? 'border-emerald-400 bg-emerald-500/10 shadow-xl shadow-emerald-500/20 scale-[1.01]'
          : 'border-slate-800 bg-slate-900/90 hover:border-slate-700/80 shadow-lg'
      }`}
    >
      {/* Widget Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
            <Hash className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide truncate">
              {widget.title || linkedVar?.name || 'Widget Numérico'}
            </h3>
            {widget.variableKey && (
              <span className="text-[10px] font-mono text-emerald-400 block truncate">
                ● {widget.variableKey}
              </span>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1">
          {/* Resize Button */}
          <button
            onClick={cycleColSpan}
            title={`Tamaño actual: ${widget.colSpan}x. Clic para cambiar tamaño`}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition flex items-center gap-1 text-[11px] font-mono"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{widget.colSpan} col</span>
          </button>

          {/* Unlink variable button */}
          {widget.variableKey && (
            <button
              onClick={() => onUpdateWidget(widget.id, { variableKey: null })}
              title="Desvincular variable"
              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition"
            >
              <Unlink className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Delete Button */}
          <button
            onClick={() => onDeleteWidget(widget.id)}
            title="Eliminar widget"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Widget Body */}
      {linkedVar ? (
        <div className="my-auto py-2">
          {/* Big Number Display */}
          <div className="flex items-baseline gap-2">
            <span className="text-4xl md:text-5xl font-extrabold font-mono text-slate-100 tracking-tight">
              {typeof linkedVar.value === 'number'
                ? Number.isInteger(linkedVar.value)
                  ? linkedVar.value
                  : linkedVar.value.toFixed(2)
                : String(linkedVar.value)}
            </span>
            {linkedVar.unit && (
              <span className="text-lg md:text-xl font-bold text-slate-400">
                {linkedVar.unit}
              </span>
            )}
          </div>

          {/* Subtitle / Timestamp */}
          <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-400 font-mono">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" />
              {linkedVar.lastUpdated ? linkedVar.lastUpdated.toLocaleTimeString() : 'Reciente'}
            </span>
            {linkedVar.min !== null && linkedVar.max !== null && (
              <div className="flex items-center gap-2 bg-slate-950/80 px-2 py-0.5 rounded-lg border border-slate-800">
                <span className="text-cyan-400 flex items-center">
                  <ArrowDownRight className="w-3 h-3" /> {linkedVar.min.toFixed(1)}
                </span>
                <span className="text-rose-400 flex items-center">
                  <ArrowUpRight className="w-3 h-3" /> {linkedVar.max.toFixed(1)}
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Empty Dropzone State */
        <div className="my-auto py-6 border-2 border-dashed border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-emerald-400 mb-2">
            <Sparkles className="w-5 h-5 animate-bounce" />
          </div>
          <span className="text-xs font-semibold text-slate-300">Arrastra una variable aquí</span>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Toma cualquier elemento del panel izquierdo y suéltalo sobre este recuadro.
          </p>

          {/* Quick select alternative */}
          {Object.keys(variables).length > 0 && (
            <div className="mt-3">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    onUpdateWidget(widget.id, {
                      variableKey: e.target.value,
                      title: e.target.value.toUpperCase(),
                    })
                  }
                }}
                defaultValue=""
                className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-[11px] text-slate-300 focus:outline-none focus:border-emerald-500"
              >
                <option value="" disabled>
                  o selecciona una variable...
                </option>
                {Object.keys(variables).map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Widget Footer */}
      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
        <span className="flex items-center gap-1">
          <Layers className="w-3 h-3" /> Grid {widget.colSpan}x
        </span>
        <span className="text-emerald-500 font-semibold">● MQTT LIVE</span>
      </div>
    </div>
  )
}
