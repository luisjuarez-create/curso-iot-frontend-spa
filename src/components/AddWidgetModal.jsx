import React, { useState } from 'react'
import {
  Hash,
  LineChart,
  Gauge,
  Droplets,
  ShieldAlert,
  BarChart2,
  Plus,
  X
} from 'lucide-react'

export function AddWidgetModal({ isOpen, onClose, onAddWidget }) {
  const [selectedType, setSelectedType] = useState('numeric')

  if (!isOpen) return null

  const widgetTypes = [
    {
      id: 'numeric',
      title: 'Widget Numérico (KPI)',
      description: 'Muestra el valor numérico en tiempo real, mínimo, máximo histórico y unidad.',
      icon: Hash,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      available: true,
    },
    {
      id: 'line_chart',
      title: 'Gráfica Temporal (Línea)',
      description: 'Curva en tiempo real con historial de lecturas, gradiente y punto de pulso.',
      icon: LineChart,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      available: true,
    },
    {
      id: 'gauge',
      title: 'Medidor Radial (Gauge)',
      description: 'Velocímetro semicircular con arco dinámico de colores y porcentaje de rango.',
      icon: Gauge,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      available: true,
    },
    {
      id: 'level_bar',
      title: 'Nivel / Batería / Tanque',
      description: 'Barra de progreso segmentada para niveles de líquido, porcentaje o batería.',
      icon: Droplets,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      available: true,
    },
    {
      id: 'status_indicator',
      title: 'Alerta y Estado (LED)',
      description: 'Indicador visual de estado operacional y advertencias según umbrales de seguridad.',
      icon: ShieldAlert,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      available: true,
    },
    {
      id: 'bar_chart',
      title: 'Barras Históricas',
      description: 'Histograma con las últimas 16 muestras comparadas en columnas verticales.',
      icon: BarChart2,
      color: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
      available: true,
    },
  ]

  const handleCreate = () => {
    onAddWidget(selectedType)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-800/40">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">Agregar Nuevo Widget</h2>
            <p className="text-xs text-slate-400">Selecciona el tipo de visualización que mejor se adapte a tu variable</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Options Grid */}
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto">
          {widgetTypes.map((type) => {
            const Icon = type.icon
            const isSelected = selectedType === type.id
            return (
              <div
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`p-3.5 rounded-xl border transition flex items-start gap-3 cursor-pointer ${
                  isSelected
                    ? 'border-emerald-500/80 bg-emerald-500/10 shadow-sm shadow-emerald-500/10'
                    : 'border-slate-800 bg-slate-800/40 hover:bg-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className={`p-2 rounded-xl border ${type.color} shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 truncate">{type.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed line-clamp-2">
                    {type.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-800/20 flex justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleCreate}
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Añadir al Lienzo
          </button>
        </div>
      </div>
    </div>
  )
}
