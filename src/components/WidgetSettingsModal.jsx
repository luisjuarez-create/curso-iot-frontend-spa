import React, { useState } from 'react'
import { Settings, X, Check, Palette, Sliders, Ruler, Tag, AlertTriangle } from 'lucide-react'
import {
  VARIABLE_TYPES,
  DEFAULT_COLORS,
  getVariableType,
  getScale,
  requiresScale,
  supportsScale,
} from '../lib/widgetSettings.js'

export function WidgetSettingsModal({ isOpen, widget, onClose, onSave }) {
  if (!isOpen || !widget) return null

  return <WidgetSettingsForm key={widget.id} widget={widget} onClose={onClose} onSave={onSave} />
}

const toInput = (v) => (v === null || v === undefined ? '' : v)
const toNumberOrNull = (v) => (v === '' ? null : Number(v))

const inputClass =
  'w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500'

function WidgetSettingsForm({ widget, onClose, onSave }) {
  const currentSettings = widget.settings || {}
  const scaleRequired = requiresScale(widget.type)
  const showScale = supportsScale(widget.type)

  const [title, setTitle] = useState(widget.title || '')
  const [variableType, setVariableType] = useState(currentSettings.variableType || 'generic')
  const [unit, setUnit] = useState(currentSettings.unit || '')
  const initialScale = scaleRequired ? getScale(currentSettings) : {}
  const [scaleMin, setScaleMin] = useState(toInput(scaleRequired ? initialScale.min : currentSettings.scaleMin))
  const [scaleMax, setScaleMax] = useState(toInput(scaleRequired ? initialScale.max : currentSettings.scaleMax))
  const [min, setMin] = useState(toInput(currentSettings.min))
  const [max, setMax] = useState(toInput(currentSettings.max))
  const [minColor, setMinColor] = useState(currentSettings.minColor || DEFAULT_COLORS.minColor)
  const [normalColor, setNormalColor] = useState(currentSettings.normalColor || DEFAULT_COLORS.normalColor)
  const [maxColor, setMaxColor] = useState(currentSettings.maxColor || DEFAULT_COLORS.maxColor)
  const [error, setError] = useState('')

  const typeDef = getVariableType(variableType)

  const handleTypeChange = (newType) => {
    setVariableType(newType)
    const def = getVariableType(newType)
    setUnit(def.units.length > 0 ? def.units[0].id : '')
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (scaleRequired && (scaleMin === '' || scaleMax === '')) {
      setError('Define la escala mínima y máxima para este widget.')
      return
    }
    if (scaleMin !== '' && scaleMax !== '' && Number(scaleMax) <= Number(scaleMin)) {
      setError('La escala máxima debe ser mayor que la escala mínima.')
      return
    }
    if (min !== '' && max !== '' && Number(max) <= Number(min)) {
      setError('La alerta alta debe ser mayor que la alerta baja.')
      return
    }

    onSave(widget.id, {
      title: title.trim(),
      settings: {
        variableType,
        unit: unit.trim(),
        scaleMin: showScale ? toNumberOrNull(scaleMin) : null,
        scaleMax: showScale ? toNumberOrNull(scaleMax) : null,
        min: toNumberOrNull(min),
        max: toNumberOrNull(max),
        minColor,
        normalColor,
        maxColor,
      },
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Configuración del Widget</h2>
              <p className="text-[11px] text-slate-400">Tipo de variable, escala, alertas y colores</p>
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
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
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
              className={`${inputClass} font-semibold`}
            />
          </div>

          {/* Variable Type & Unit */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <span className="block text-[11px] font-medium text-slate-300 uppercase tracking-wider flex items-center gap-1">
              <Tag className="w-3 h-3 text-emerald-400" />
              Tipo de Variable
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Tipo</label>
                <select
                  value={variableType}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className={inputClass}
                >
                  {VARIABLE_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Unidad de medida</label>
                {typeDef.units.length > 0 ? (
                  <select value={unit} onChange={(e) => setUnit(e.target.value)} className={inputClass}>
                    {typeDef.units.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="Ej. RPM (opcional)"
                    maxLength={12}
                    className={`${inputClass} font-mono`}
                  />
                )}
              </div>
            </div>
            <p className="text-[10px] text-slate-500 leading-snug">
              La unidad solo se muestra junto al valor; no convierte datos. Elige la misma unidad en la que publica tu dispositivo.
            </p>
          </div>

          {/* Scale Range */}
          {showScale && (
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <span className="block text-[11px] font-medium text-slate-300 uppercase tracking-wider flex items-center gap-1">
                <Ruler className="w-3 h-3 text-emerald-400" />
                Rango de Escala {scaleRequired && <span className="text-rose-400">*</span>}
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Escala mínima</label>
                  <input
                    type="number"
                    step="any"
                    value={scaleMin}
                    onChange={(e) => setScaleMin(e.target.value)}
                    placeholder={scaleRequired ? '0' : 'Según datos'}
                    required={scaleRequired}
                    className={`${inputClass} font-mono`}
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Escala máxima</label>
                  <input
                    type="number"
                    step="any"
                    value={scaleMax}
                    onChange={(e) => setScaleMax(e.target.value)}
                    placeholder={scaleRequired ? '100' : 'Según datos'}
                    required={scaleRequired}
                    className={`${inputClass} font-mono`}
                  />
                </div>
              </div>
              <p className="text-[10px] text-slate-500 leading-snug">
                {scaleRequired
                  ? 'Valores que corresponden al inicio y al final del indicador (vacío y lleno). Por defecto 0 a 100.'
                  : 'Límites del eje vertical. Si los dejas vacíos, la gráfica se ajusta a las lecturas recibidas.'}
              </p>
            </div>
          )}

          {/* Alert Thresholds */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <span className="block text-[11px] font-medium text-slate-300 uppercase tracking-wider flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              Umbrales de Alerta (opcional)
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1 flex items-center gap-1">
                  <Sliders className="w-3 h-3 text-cyan-400" />
                  Alerta baja
                </label>
                <input
                  type="number"
                  step="any"
                  value={min}
                  onChange={(e) => setMin(e.target.value)}
                  placeholder="Sin alerta"
                  className={`${inputClass} font-mono focus:border-cyan-500`}
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1 flex items-center gap-1">
                  <Sliders className="w-3 h-3 text-rose-400" />
                  Alerta alta
                </label>
                <input
                  type="number"
                  step="any"
                  value={max}
                  onChange={(e) => setMax(e.target.value)}
                  placeholder="Sin alerta"
                  className={`${inputClass} font-mono focus:border-rose-500`}
                />
              </div>
            </div>
            <p className="text-[10px] text-slate-500 leading-snug">
              Por debajo de la alerta baja se usa el color "Bajo"; por encima de la alerta alta, el color "Alto"; entre ambas, el color "Normal".
            </p>
          </div>

          {/* Color Selectors for Min, Normal, Max */}
          <div className="pt-3 border-t border-slate-800 space-y-2.5">
            <span className="block text-[11px] font-medium text-slate-300 uppercase tracking-wider flex items-center gap-1">
              <Palette className="w-3 h-3 text-emerald-400" />
              Colores por Zona:
            </span>

            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Bajo', value: minColor, set: setMinColor },
                { label: 'Normal', value: normalColor, set: setNormalColor },
                { label: 'Alto', value: maxColor, set: setMaxColor },
              ].map((c) => (
                <div
                  key={c.label}
                  className="p-2.5 rounded-xl border border-slate-800 bg-slate-950 flex flex-col items-center gap-1.5"
                >
                  <span className="text-[10px] text-slate-400 font-medium">{c.label}</span>
                  <input
                    type="color"
                    value={c.value}
                    onChange={(e) => c.set(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                  />
                  <span className="text-[9px] font-mono text-slate-500 uppercase">{c.value}</span>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-[11px] text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

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
