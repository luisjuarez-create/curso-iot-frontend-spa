import React, { useState, useRef } from 'react'
import {
  GripHorizontal,
  Trash2,
  Unlink,
  Sparkles,
  Settings,
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
  onOpenSettings,
}) {
  const [isDragOverVariable, setIsDragOverVariable] = useState(false)
  const [isDragOverWidget, setIsDragOverWidget] = useState(false)
  const [isDraggingSelf, setIsDraggingSelf] = useState(false)

  // Estado local para redimensionamiento fluido estilo CloudWatch
  const [isResizing, setIsResizing] = useState(false)
  const [resizePreview, setResizePreview] = useState(null) // { colSpan, rowSpan }

  const cardRef = useRef(null)
  const resizeStateRef = useRef(null)

  const linkedVar = widget.variableKey ? variables[widget.variableKey] : null
  const settings = widget.settings || {}

  // 1. MANEJO DE DRAG & DROP DE VARIABLES Y REORDENAMIENTO
  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'

    const types = e.dataTransfer.types
    if (types.includes('application/x-widget-id') || types.includes('text/plain')) {
      setIsDragOverWidget(true)
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

    const textData = e.dataTransfer.getData('text/plain') || ''
    const widgetIdData = e.dataTransfer.getData('widget-id') || e.dataTransfer.getData('application/x-widget-id')

    if (widgetIdData || textData.startsWith('widget:')) {
      // Reordenar widget
      const draggedWidgetId = widgetIdData || textData.replace('widget:', '')
      if (draggedWidgetId && draggedWidgetId !== widget.id) {
        onReorderWidgets(draggedWidgetId, widget.id)
      }
    } else if (textData) {
      // Vincular variable del panel izquierdo o mobile drawer
      const varKey = textData.replace('variable:', '')
      onUpdateWidget(widget.id, {
        variableKey: varKey,
        title: widget.title && widget.title !== 'NUEVO WIDGET' ? widget.title : varKey.toUpperCase(),
      })
    }
  }

  // 2. DRAG START DEL BOTON DE 6 PUNTOS (Mover Widget)
  const handleWidgetDragStart = (e) => {
    setIsDraggingSelf(true)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', `widget:${widget.id}`)
    e.dataTransfer.setData('widget-id', widget.id)
    e.dataTransfer.setData('application/x-widget-id', widget.id)

    if (cardRef.current) {
      e.dataTransfer.setDragImage(cardRef.current, 20, 20)
    }
  }

  const handleWidgetDragEnd = () => {
    setIsDraggingSelf(false)
  }

  // 3. REDIMENSIONAMIENTO BIDIRECCIONAL ESTILO AWS CLOUDWATCH
  const handleResizePointerDown = (e) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      e.target.setPointerCapture(e.pointerId)
    } catch (err) {
      // Fallback
    }

    const cardEl = cardRef.current
    if (!cardEl) return

    const rect = cardEl.getBoundingClientRect()
    const currentCol = widget.colSpan || 1
    const currentRow = widget.rowSpan || 1

    const colWidth = Math.max(rect.width / currentCol, 80)
    const rowHeight = Math.max(rect.height / currentRow, 140)

    resizeStateRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      initialColSpan: currentCol,
      initialRowSpan: currentRow,
      colWidth,
      rowHeight,
      lastColSpan: currentCol,
      lastRowSpan: currentRow,
    }

    setIsResizing(true)
    setResizePreview({ colSpan: currentCol, rowSpan: currentRow })
  }

  const handleResizePointerMove = (e) => {
    if (!isResizing || !resizeStateRef.current) return
    e.preventDefault()

    const { startX, startY, initialColSpan, initialRowSpan, colWidth, rowHeight } = resizeStateRef.current

    const diffX = e.clientX - startX
    const diffY = e.clientY - startY

    // Columnas (1 a 4)
    const colStep = Math.round(diffX / (colWidth * 0.7))
    const newColSpan = Math.max(1, Math.min(4, initialColSpan + colStep))

    // Filas (1 a 3)
    const rowStep = Math.round(diffY / (rowHeight * 0.7))
    const newRowSpan = Math.max(1, Math.min(3, initialRowSpan + rowStep))

    resizeStateRef.current.lastColSpan = newColSpan
    resizeStateRef.current.lastRowSpan = newRowSpan

    setResizePreview({ colSpan: newColSpan, rowSpan: newRowSpan })
  }

  const handleResizePointerUp = (e) => {
    if (!isResizing) return
    e.preventDefault()

    try {
      e.target.releasePointerCapture(e.pointerId)
    } catch (err) {
      // Ignorar
    }

    const finalCols = resizeStateRef.current?.lastColSpan || widget.colSpan || 1
    const finalRows = resizeStateRef.current?.lastRowSpan || widget.rowSpan || 1

    setIsResizing(false)
    setResizePreview(null)
    resizeStateRef.current = null

    onUpdateWidget(widget.id, {
      colSpan: finalCols,
      rowSpan: finalRows,
    })
  }

  // Clases CSS de columnas y filas
  const activeColSpan = isResizing && resizePreview ? resizePreview.colSpan : widget.colSpan || 1
  const activeRowSpan = isResizing && resizePreview ? resizePreview.rowSpan : widget.rowSpan || 1

  const getColSpanClass = () => {
    switch (activeColSpan) {
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

  const getRowSpanClass = () => {
    switch (activeRowSpan) {
      case 2:
        return 'row-span-2 min-h-[340px]'
      case 3:
        return 'row-span-3 min-h-[500px]'
      default:
        return 'row-span-1 min-h-[190px]'
    }
  }

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

  const renderWidgetBody = () => {
    if (!linkedVar) {
      return (
        <div className="my-auto py-5 border-2 border-dashed border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center text-center">
          <div className="w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-emerald-400 mb-2">
            <Sparkles className="w-4 h-4 animate-bounce" />
          </div>
          <span className="text-xs font-semibold text-slate-300">Arrastra una variable aquí</span>
          <p className="text-[10px] text-slate-500 mt-0.5">
            Suelta desde el panel o selecciona una variable abajo
          </p>

          {Object.keys(variables).length > 0 && (
            <div className="mt-2.5 w-full max-w-xs">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    onUpdateWidget(widget.id, {
                      variableKey: e.target.value,
                      title: widget.title && widget.title !== 'NUEVO WIDGET' ? widget.title : e.target.value.toUpperCase(),
                    })
                  }
                }}
                defaultValue=""
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500 truncate"
              >
                <option value="" disabled>
                  Seleccionar variable...
                </option>
                {Object.keys(variables).map((k) => (
                  <option key={k} value={k}>
                    {k} ({typeof variables[k].value === 'number' ? variables[k].value.toFixed(1) : variables[k].value} {variables[k].unit})
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
        return <LineChartWidget variable={linkedVar} settings={settings} />
      case 'gauge':
        return <GaugeWidget variable={linkedVar} settings={settings} />
      case 'level_bar':
        return <LevelBarWidget variable={linkedVar} settings={settings} />
      case 'status_indicator':
        return <StatusWidget variable={linkedVar} settings={settings} />
      case 'bar_chart':
        return <BarChartWidget variable={linkedVar} settings={settings} />
      default:
        return <NumericWidgetView variable={linkedVar} settings={settings} />
    }
  }

  return (
    <div
      ref={cardRef}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`rounded-2xl border transition-all duration-150 relative overflow-hidden flex flex-col justify-between p-4 select-none ${getColSpanClass()} ${getRowSpanClass()} ${
        isDraggingSelf
          ? 'opacity-30 border-dashed border-emerald-400 scale-[0.98]'
          : isDragOverWidget
          ? 'border-cyan-400 ring-2 ring-cyan-400/40 bg-cyan-950/20'
          : isDragOverVariable
          ? 'border-emerald-400 ring-2 ring-emerald-400/40 bg-emerald-950/20 scale-[1.01]'
          : isResizing
          ? 'border-emerald-400 ring-2 ring-emerald-400 shadow-2xl shadow-emerald-500/20'
          : 'border-slate-800/90 bg-slate-900/90 hover:border-slate-700/80 shadow-lg'
      }`}
    >
      {/* Overlay de Redimensionamiento interactivo */}
      {isResizing && (
        <div className="absolute inset-0 bg-emerald-950/30 backdrop-blur-[2px] z-20 flex items-center justify-center pointer-events-none border-2 border-emerald-400 rounded-2xl">
          <div className="bg-slate-900/95 border border-emerald-400 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold text-emerald-300 shadow-xl flex items-center gap-2">
            <span>↔ {activeColSpan} {activeColSpan === 1 ? 'columna' : 'columnas'}</span>
            <span className="text-slate-600">|</span>
            <span>↕ {activeRowSpan} {activeRowSpan === 1 ? 'fila' : 'filas'}</span>
          </div>
        </div>
      )}

      {/* Widget Header con Asa de 6 puntos para mover de posicion */}
      <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-800/60">
        <div className="flex items-center gap-1.5 min-w-0">
          {/* Asa de 6 puntos */}
          <div
            draggable
            onDragStart={handleWidgetDragStart}
            onDragEnd={handleWidgetDragEnd}
            title="Mantén presionado y arrastra para reordenar este widget en el lienzo"
            className="p-1 rounded-md text-slate-500 hover:text-emerald-400 hover:bg-slate-800 cursor-grab active:cursor-grabbing transition"
          >
            <GripHorizontal className="w-4 h-4 stroke-[2.5]" />
          </div>

          <div className="p-1 rounded-md bg-slate-800/60 border border-slate-700/60 shrink-0">
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

        {/* Action Controls (Sin los botones < > solicitados para remover) */}
        <div className="flex items-center gap-1">
          {/* Boton de Settings para colores y max/min */}
          <button
            onClick={() => onOpenSettings(widget)}
            title="Configurar título, umbrales y colores del widget"
            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-400 hover:bg-slate-800 transition"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>

          {/* Unlink variable button */}
          {widget.variableKey && (
            <button
              onClick={() => onUpdateWidget(widget.id, { variableKey: null })}
              title="Desvincular variable"
              className="p-1.5 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-slate-800 transition"
            >
              <Unlink className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Delete Button */}
          <button
            onClick={() => onDeleteWidget(widget.id)}
            title="Eliminar widget"
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Widget Visual Body */}
      <div className="flex-1 flex flex-col justify-center">
        {renderWidgetBody()}
      </div>

      {/* Esquina Inferior Derecha: Asa de Redimensionamiento CloudWatch (Ancho y Alto) */}
      <div
        onPointerDown={handleResizePointerDown}
        onPointerMove={handleResizePointerMove}
        onPointerUp={handleResizePointerUp}
        title="Arrastra para redimensionar ancho (columnas) y alto (filas)"
        className={`absolute bottom-0 right-0 w-7 h-7 cursor-se-resize flex items-end justify-end p-1 transition-colors z-30 ${
          isResizing ? 'text-emerald-300' : 'text-slate-500 hover:text-emerald-400'
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          className="w-4 h-4 stroke-current stroke-[2.5] fill-none"
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
