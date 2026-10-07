import React, { useState } from 'react'
import { Settings, X, Check, Palette, Gauge, Sliders } from 'lucide-react'

export function WidgetSettingsModal({ isOpen, widget, onClose, onSave }) {
  if (!isOpen || !widget) return null

  const currentSettings = widget.settings || {}

  const [title, setTitle] = useState(widget.title || '')
  const [min, setMin] = useState(currentSettings.min ?? '')
  const [max, setMax] = useState(currentSettings.max ?? '')
  const [minColor, setMinColor] = useState(currentSettings.minColor || '#06b6d4') // Cyan por defecto
  const [normalColor, setNormalColor] = useState(currentSettings.normalColor || '#10b981') // Verde por defecto
  const [maxColor, setMaxColor] = useState(currentSettings.maxColor || '#ef4444') // Rojo por defecto

  const colorPresets = [
    {
      name: 'Semáforo Clásico',
      min: '#06b6d4',
      normal: '#10b981',
      max: '#ef4444',
    },
    {
      name: 'Neón Cyberpunk',
      min: '#3b82f6',
      normal: '#a855f7',
      max: '#ec4899',
    },
    {
      name: 'Térmico Calor',
      min: '#38bdf8',
      normal: '#f59e0b',
      max: '#dc2626',
    },
    {
      name: 'Industrial Amber',
      min: '#64748b',
      normal: '#14b8a6',
      max: '#f97316',
    },
  ]

  const handleApplyPreset = (preset) => {
    setMinColor(preset.min)
    setNormalColor(preset.normal)
    setMaxColor(preset.max)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(widget.id, {
      title: title.trim(),
      settings: {
        min: min !== '' ? Number(min) : null,
        max: max !== '' ? Number(max) : null,
        minColor,
        normalColor,
        maxColor,
      },
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Configuración del Widget</h2>
              <p className="text-[11px] text-slate-400">Personaliza títulos, umbrales y colores</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Título del Widget
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. TEMPERATURA MOTOR"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 font-semibold focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Min & Max Range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1">
                <Sliders className="w-3 h-3 text-cyan-400" />
                Valor Mínimo
              </label>
              <input
                type="number"
                step="any"
                value={min}
                onChange={(e) => setMin(e.target.value)}
                placeholder="Auto"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1">
                <Sliders className="w-3 h-3 text-rose-400" />
                Valor Máximo
              </label>
              <input
                type="number"
                step="any"
                value={max}
                onChange={(e) => setMax(e.target.value)}
                placeholder="Auto"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* Color Palettes / Presets */}
          <div>
            <span className="block text-[11px] font-medium text-slate-400 mb-1.5 flex items-center gap-1">
              <Palette className="w-3 h-3 text-emerald-400" />
              Paletas de Color Rápidas:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {colorPresets.map((preset) => (
                <button
                  type="button"
                  key={preset.name}
                  onClick={() => handleApplyPreset(preset)}
                  className="p-2 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-800 hover:border-slate-700 transition text-left flex items-center justify-between"
                >
                  <span className="text-[11px] text-slate-300 font-medium">{preset.name}</span>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: preset.min }} />
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: preset.normal }} />
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: preset.max }} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Color Selectors for Min, Normal, Max */}
          <div className="pt-2 border-t border-slate-800 space-y-2.5">
            <span className="block text-[11px] font-medium text-slate-300 uppercase tracking-wider">
              Colores Personalizados por Zona:
            </span>

            <div className="grid grid-cols-3 gap-2">
              {/* Min Color */}
              <div className="p-2.5 rounded-xl border border-slate-800 bg-slate-950 flex flex-col items-center gap-1.5">
                <span className="text-[10px] text-slate-400 font-medium">Bajo / Mín</span>
                <input
                  type="color"
                  value={minColor}
                  onChange={(e) => setMinColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                />
                <span className="text-[9px] font-mono text-slate-500 uppercase">{minColor}</span>
              </div>

              {/* Normal Color */}
              <div className="p-2.5 rounded-xl border border-slate-800 bg-slate-950 flex flex-col items-center gap-1.5">
                <span className="text-[10px] text-slate-400 font-medium">Normal / Medio</span>
                <input
                  type="color"
                  value={normalColor}
                  onChange={(e) => setNormalColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                />
                <span className="text-[9px] font-mono text-slate-500 uppercase">{normalColor}</span>
              </div>

              {/* Max Color */}
              <div className="p-2.5 rounded-xl border border-slate-800 bg-slate-950 flex flex-col items-center gap-1.5">
                <span className="text-[10px] text-slate-400 font-medium">Alto / Máx</span>
                <input
                  type="color"
                  value={maxColor}
                  onChange={(e) => setMaxColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                />
                <span className="text-[9px] font-mono text-slate-500 uppercase">{maxColor}</span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition"
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
