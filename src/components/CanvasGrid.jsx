import React from 'react'
import { WidgetContainer } from './WidgetContainer.jsx'
import { Plus, LayoutGrid, Sparkles, Link2, X } from 'lucide-react'

export function CanvasGrid({
  widgets,
  variables,
  onUpdateWidget,
  onDeleteWidget,
  onReorderWidgets,
  onOpenAddWidgetModal,
  onOpenSettings,
  onClearAll,
  bindingVariable,
  onCancelBinding,
  onSelectForBinding,
}) {
  const handleReorder = (draggedId, targetId) => {
    const fromIndex = widgets.findIndex((w) => w.id === draggedId)
    const toIndex = widgets.findIndex((w) => w.id === targetId)

    if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return

    const updated = [...widgets]
    const [moved] = updated.splice(fromIndex, 1)
    updated.splice(toIndex, 0, moved)
    onReorderWidgets(updated)
  }

  return (
    <main className="flex-1 w-full lg:w-[80%] bg-slate-950 p-3 sm:p-6 pb-6 overflow-y-auto">
      {/* Banner de Modo Vinculación Activo */}
      {bindingVariable && (
        <div className="mb-4 p-3 bg-emerald-950/80 border-2 border-emerald-500/60 rounded-2xl flex items-center justify-between shadow-xl shadow-emerald-950/50 backdrop-blur animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 animate-pulse">
              <Link2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                <span>Modo Vinculación Activo</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </p>
              <p className="text-[11px] text-slate-300 truncate mt-0.5">
                Toca cualquier widget para asignarle: <span className="font-mono text-emerald-400 font-bold bg-slate-900/80 px-1.5 py-0.5 rounded border border-emerald-500/30">{bindingVariable}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onCancelBinding}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition shrink-0 ml-2 shadow-sm"
          >
            <X className="w-3.5 h-3.5" />
            <span>Cancelar</span>
          </button>
        </div>
      )}

      {/* Canvas Top Bar */}
      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-900">
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold text-slate-200">Lienzo de Monitoreo</h2>
          <span className="text-xs text-slate-500 font-mono">
            ({widgets.length} {widgets.length === 1 ? 'widget' : 'widgets'})
          </span>
        </div>

        <div className="flex items-center gap-2">
          {widgets.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-xs text-slate-500 hover:text-rose-400 transition px-2 py-1"
            >
              Limpiar Lienzo
            </button>
          )}
          {/* Botón en top bar visible a partir de sm (en móvil se usa el footer docked) */}
          <button
            onClick={onOpenAddWidgetModal}
            className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Nuevo Widget</span>
          </button>
        </div>
      </div>

      {/* Grid or Empty State */}
      {widgets.length === 0 ? (
        <div className="h-[65vh] flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-900 rounded-3xl">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 shadow-xl shadow-emerald-500/5">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-100">Lienzo Listo para Widgets</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md leading-relaxed">
            Puedes agregar 6 tipos de visualizaciones (Numérico, Gráfica de Líneas, Medidor Gauge,
            Barra de Nivel, Alerta LED y Barras Históricas).
          </p>

          <button
            onClick={onOpenAddWidgetModal}
            className="mt-6 flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Agregar Primer Widget
          </button>
        </div>
      ) : (
        /* The Responsive Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 auto-rows-fr">
          {widgets.map((widget) => (
            <WidgetContainer
              key={widget.id}
              widget={widget}
              variables={variables}
              onUpdateWidget={onUpdateWidget}
              onDeleteWidget={onDeleteWidget}
              onReorderWidgets={handleReorder}
              onOpenSettings={onOpenSettings}
              bindingVariable={bindingVariable}
              onSelectForBinding={onSelectForBinding}
            />
          ))}
        </div>
      )}
    </main>
  )
}
