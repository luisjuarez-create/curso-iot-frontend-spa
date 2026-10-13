import React, { useState } from 'react'
import {
  Hash,
  LineChart,
  Gauge,
  Droplets,
  ShieldAlert,
  BarChart2,
  Power,
  Palette,
  Grid3x3,
  Activity,
  SlidersHorizontal,
  Plus,
  X
} from 'lucide-react'

const CATEGORIES = [
  {
    id: 'indicators',
    label: 'Indicadores',
    icon: Activity,
    subtitle: 'Muestran una variable que publica tu dispositivo',
    widgets: [
      {
        id: 'numeric',
        title: 'Widget Numérico (KPI)',
        description: 'Muestra el valor numérico en tiempo real, mínimo, máximo histórico y unidad.',
        icon: Hash,
        color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      },
      {
        id: 'line_chart',
        title: 'Gráfica Temporal (Línea)',
        description: 'Curva en tiempo real con historial de lecturas, gradiente y punto de pulso.',
        icon: LineChart,
        color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      },
      {
        id: 'gauge',
        title: 'Medidor Radial (Gauge)',
        description: 'Velocímetro semicircular con arco dinámico de colores y porcentaje de rango.',
        icon: Gauge,
        color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      },
      {
        id: 'level_bar',
        title: 'Nivel / Batería / Tanque',
        description: 'Barra de progreso segmentada para niveles de líquido, porcentaje o batería.',
        icon: Droplets,
        color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      },
      {
        id: 'status_indicator',
        title: 'Alerta y Estado (LED)',
        description: 'Indicador visual de estado operacional y advertencias según umbrales de seguridad.',
        icon: ShieldAlert,
        color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      },
      {
        id: 'bar_chart',
        title: 'Barras Históricas',
        description: 'Histograma con las últimas 16 muestras comparadas en columnas verticales.',
        icon: BarChart2,
        color: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
      },
    ],
  },
  {
    id: 'controls',
    label: 'Controles',
    icon: SlidersHorizontal,
    subtitle: 'Envían comandos a tu dispositivo por devices/<id>/cmd',
    widgets: [
      {
        id: 'switch',
        title: 'Interruptor ON/OFF',
        description: 'Envía {"led": true/false} al dispositivo y muestra si lo confirmó.',
        icon: Power,
        color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      },
      {
        id: 'color_picker',
        title: 'Color RGB',
        description: 'Elige un color y envía {"color": "#rrggbb"} al LED RGB del dispositivo.',
        icon: Palette,
        color: 'text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20',
      },
      {
        id: 'led_matrix',
        title: 'Matriz LED (Dibujo)',
        description: 'Dibuja en una cuadrícula de 8×13 y envía {"matrix": [...]} a la matriz LED del UNO Q.',
        icon: Grid3x3,
        color: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
      },
    ],
  },
]

export function AddWidgetModal({ isOpen, onClose, onAddWidget }) {
  const [categoryId, setCategoryId] = useState(CATEGORIES[0].id)
  const [selectedType, setSelectedType] = useState(CATEGORIES[0].widgets[0].id)

  if (!isOpen) return null

  const category = CATEGORIES.find((c) => c.id === categoryId)

  const selectCategory = (c) => {
    setCategoryId(c.id)
    setSelectedType(c.widgets[0].id)
  }

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
            <p className="text-xs text-slate-400">{category.subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Categorías */}
        <div className="px-5 pt-4 flex gap-2">
          {CATEGORIES.map((c) => {
            const Icon = c.icon
            const active = c.id === categoryId
            return (
              <button
                key={c.id}
                onClick={() => selectCategory(c)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition ${
                  active
                    ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-300'
                    : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {c.label}
                <span
                  className={`text-[10px] font-mono px-1.5 rounded-full ${
                    active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {c.widgets.length}
                </span>
              </button>
            )
          })}
        </div>

        {/* Options Grid */}
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto">
          {category.widgets.map((type) => {
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
