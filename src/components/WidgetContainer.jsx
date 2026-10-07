import React, { useState, useRef } from 'react'
import {
  GripHorizontal,
  Trash2,
  Unlink,
  Sparkles,
  Hash,
  LineChart,
  Gauge,
  Droplets,
  ShieldAlert,
  BarChart2
} from 'lucide-react'

import { NumericWidgetView } from './widgets/NumericWidgetView.jsx'
import { LineChartWidget } from './widgets/LineChartWidget.jsx'
import { GaugeWidget } from './widgets/GaugeWidget.jsx'
import { LevelBarWidget } from './widgets/LevelBarWidget.jsx'
import { StatusWidget } from './widgets/StatusWidget.jsx'
import { BarChartWidget } from './widgets/BarChartWidget.jsx'

export function WidgetContainer({
  widget,
  variables,
  onUpdateWidget,
  onDeleteWidget,
  onReorderWidgets,
}) {
  const [isDragOverVariable, setIsDragOverVariable] = useState(false)
  const [isDragOverWidget, setIsDragOverWidget] = useState(false)
  const cardRef = useRef(null)

  const linkedVar = widget.variableKey ? variables[widget.variableKey] : null

  // 1. Manejo de Drag & Drop para variables y reordenamiento de widgets
  const handleDragOver = (e) => {
    e.preventDefault()
    // Verificamos si lo que se arrastra es una variable o un widget
    const isVariable = e.dataTransfer.types.includes('text/plain')
    if (isVariable) {
      setIsDragOverVariable(true)
    }
  }

  const handleDragLeave = () => {
    setIsDragOverVariable(false)
    setIsDragOverWidget(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOverVariable(false)
    setIsDragOverWidget(false)

    const dragType = e.dataTransfer.getData('drag-type')

    if (dragType === 'widget') {
      const draggedWidgetId = e.dataTransfer.getData('widget-id')
      if (draggedWidgetId && draggedWidgetId !== widget.id) {
        onReorderWidgets(draggedWidgetId, widget.id)
      }
    } else {
      // Es una variable del panel izquierdo
      const varKey = e.dataTransfer.getData('text/plain')
      if (varKey) {
        onUpdateWidget(widget.id, {
          variableKey: varKey,
          title: widget.title && widget.title !== 'NUEVO WIDGET' ? widget.title : varKey.toUpperCase(),
        })
      }
    }
  }

  // 2. Drag Start para mover este widget de lugar
  const handleWidgetDragStart = (e) => {
    e.dataTransfer.setData('drag-type', 'widget')
    e.dataTransfer.setData('widget-id', widget.id)
    e.dataTransfer.effectAllowed = 'move'
  }

  // 3. Manejo interactivo de redimensionamiento desde la esquina inferior derecha
  const handleResizeMouseDown = (e) => {
    e.preventDefault()
    e.stopPropagation()

    const startX = e.clientX
    const initialColSpan = widget.colSpan || 1

    const handleMouseMove = (moveEvent) => {
      const diffX = moveEvent.clientX - startX
      // Cada ~90px de arrastre hacia la derecha o izquierda cambia 1 columna
      const colStep = Math.round(diffX / 90)
      let newColSpan = Math.max(1, Math.min(4, initialColSpan + colStep))
      if (newColSpan !== widget.colSpan) {
        onUpdateWidget(widget.id, { colSpan: newColSpan })
      }
    }

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }

  // Clic directo en el asa de la esquina para alternar columnas si no se arrastra
  const handleCornerClick = (e) => {
    e.stopPropagation()
    const nextCols = widget.colSpan >= 4 ? 1 : widget.colSpan + 1
    onUpdateWidget(widget.id, { colSpan: nextCols })
  }

  // Icono segun el tipo de widget
  const getTypeIcon = () => {
    switch (widget.type) {
      case 'line_chart':
        return <LineChart className="w-3.5 h-3.5 text-cyan-400" />
      case 'gauge':
        return <Gauge className="w-3.5 h-3.5 text-amber-400" />
      case 'level_bar':
        return <Droplets className="w-3.5 h-3.5 text-blue-400" />
      case 'status_indicator':
        return <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
      case 'bar_chart':
        return <BarChart2 className="w-3.5 h-3.5 text-teal-400" />
      default:
        return <Hash className="w-3.5 h-3.5 text-emerald-400" />
    }
  }

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

  // Renderizar la vista segun el tipo
  const renderWidgetBody = () => {
    if (!linkedVar) {
      return (
        <div className="my-auto py-5 border-2 border-dashed border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center text-center">
          <div className="w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-emerald-400 mb-2">
            <Sparkles className="w-4 h-4 animate-bounce" />
          </div>
          <span className="text-xs font-semibold text-slate-300">Arrastra una variable aquí</span>
          <p className="text-[10px] text-slate-500 mt-0.5">
            Suelta desde el panel izquierdo para conectar
          </p>

          {Object.keys(variables).length > 0 && (
            <div className="mt-2.5">
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
                className="bg-slate-950 border border-slate-750 rounded-lg px-2 py-1 text-[11px] text-slate-300 focus:outline-none focus:border-emerald-500"
              >
                <option value="" disabled>
                  o vincular variable...
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
      )
    }

    switch (widget.type) {
      case 'line_chart':
        return <LineChartWidget variable={linkedVar} />
      case 'gauge':
        return <GaugeWidget variable={linkedVar} />
      case 'level_bar':
        return <LevelBarWidget variable={linkedVar} />
      case 'status_indicator':
        return <StatusWidget variable={linkedVar} />
      case 'bar_chart':
        return <BarChartWidget variable={linkedVar} />
      default:
        return <NumericWidgetView variable={linkedVar} />
    }
  }

  return (
    <div
      ref={cardRef}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`rounded-2xl border transition-all duration-200 relative overflow-hidden flex flex-col justify-between p-4 select-none ${getColSpanClass()} ${
        isDragOverVariable
          ? 'border-emerald-400 bg-emerald-500/10 shadow-xl shadow-emerald-500/20 scale-[1.01]'
          : 'border-slate-800/90 bg-slate-900/90 hover:border-slate-700/80 shadow-lg'
      }`}
    >
      {/* Widget Header con Asa para arrastrar el widget */}
      <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-800/60">
        <div className="flex items-center gap-1.5 min-w-0">
          {/* Grip para mover el widget por el lienzo */}
          <div
            draggable
            onDragStart={handleWidgetDragStart}
            title="Arrastra para mover de posición este widget en el lienzo"
            className="p-1 rounded-md text-slate-500 hover:text-slate-200 hover:bg-slate-800 cursor-grab active:cursor-grabbing transition"
          >
            <GripHorizontal className="w-3.5 h-3.5" />
          </div>

          <div className="p-1 rounded-md bg-slate-800/60 border border-slate-700/60">
            {getTypeIcon()}
          </div>

          <div className="min-w-0">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide truncate">
              {widget.title || linkedVar?.name || 'Widget'}
            </h3>
            {widget.variableKey && (
              <span className="text-[10px] font-mono text-emerald-400 block truncate">
                ● {widget.variableKey}
              </span>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          {widget.variableKey && (
            <button
              onClick={() => onUpdateWidget(widget.id, { variableKey: null })}
              title="Desvincular variable"
              className="p-1 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-slate-800 transition"
            >
              <Unlink className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => onDeleteWidget(widget.id)}
            title="Eliminar widget"
            className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Widget Visual Body */}
      <div className="flex-1 flex flex-col justify-center min-h-[140px]">
        {renderWidgetBody()}
      </div>

      {/* Widget Footer */}
      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 font-mono mt-1">
        <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
          Grid: {widget.colSpan} col
        </span>
        <span className="text-emerald-400 font-semibold mr-6">● LIVE</span>
      </div>

      {/* Esquina Inferior Derecha: Asa de Redimensionamiento interactivo */}
      <div
        onMouseDown={handleResizeMouseDown}
        onClick={handleCornerClick}
        title="Arrastra hacia los lados para redimensionar columnas (o haz clic para alternar)"
        className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize flex items-end justify-end p-1 text-slate-500 hover:text-emerald-400 transition group z-10"
      >
        <svg
          viewBox="0 0 24 24"
          className="w-3.5 h-3.5 stroke-current stroke-[2.5] fill-none group-hover:scale-125 transition"
        >
          <path d="M21 15v6h-6" />
          <path d="M21 9v2" />
          <path d="M15 21h-2" />
          <path d="M9 21h-2" />
        </svg>
      </div>
    </div>
  )
}
