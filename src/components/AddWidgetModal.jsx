import React, { useState } from 'react'
import { Hash, LineChart, Gauge, Plus, X } from 'lucide-react'

export function AddWidgetModal({ isOpen, onClose, onAddWidget }) {
  const [selectedType, setSelectedType] = useState('numeric')

  if (!isOpen) return null

  const widgetTypes = [
    {
      id: 'numeric',
      title: 'Widget Numérico',
      description: 'Muestra el valor numérico en tiempo real, mínimo, máximo y unidad. Con tamaño ajustable.',
      icon: Hash,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      available: true,
    },
    {
      id: 'line_chart',
      title: 'Gráfica Temporal',
      description: 'Curva en tiempo real con historial de valores y escala automática.',
      icon: LineChart,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      available: false,
      tag: 'Próximamente',
    },
    {
      id: 'gauge',
      title: 'Medidor / Gauge',
      description: 'Indicador radial tipo velocímetro para rangos de sensores con zonas de alerta.',
      icon: Gauge,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      available: false,
      tag: 'Próximamente',
    },
  ]

  const handleCreate = () => {
    onAddWidget(selectedType)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-800/40">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">Agregar Nuevo Widget</h2>
            <p className="text-xs text-slate-400">Selecciona el tipo de visualización para el lienzo</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Options */}
        <div className="p-5 space-y-3">
          {widgetTypes.map((type) => {
            const Icon = type.icon
            const isSelected = selectedType === type.id
            return (
              <div
                key={type.id}
                onClick={() => type.available && setSelectedType(type.id)}
                className={`p-3.5 rounded-xl border transition flex items-start gap-3.5 cursor-pointer ${
                  !type.available
                    ? 'opacity-50 cursor-not-allowed border-slate-800 bg-slate-950/40'
                    : isSelected
                    ? 'border-emerald-500/80 bg-emerald-500/10 shadow-sm shadow-emerald-500/10'
                    : 'border-slate-800 bg-slate-800/40 hover:bg-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className={`p-2.5 rounded-xl border ${type.color} shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-200">{type.title}</span>
                    {type.tag && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                        {type.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{type.description}</p>
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
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-semibold text-xs px-4 py-2 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Crear Widget
          </button>
        </div>
      </div>
    </div>
  )
}
