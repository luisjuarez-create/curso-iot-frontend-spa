import React from 'react'
import { WidgetContainer } from './WidgetContainer.jsx'
import { Plus, LayoutGrid, Sparkles, Link2, X, Trash2 } from 'lucide-react'

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
    <main className="flex-1 w-full lg:w-[75%] bg-slate-950 p-3 sm:p-5 pb-6 overflow-y-auto">
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

      {/* Canvas Top Bar: Fila única compacta solo con indicador y botones */}
      <div className="flex items-center justify-between pb-2 mb-3.5 border-b border-slate-900/80">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <LayoutGrid className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-mono font-semibold text-slate-300 bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded-lg whitespace-nowrap shadow-inner">
            {widgets.length} {widgets.length === 1 ? 'widget' : 'widgets'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {widgets.length > 0 && (
            <button
              onClick={onClearAll}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 bg-slate-900/80 hover:bg-rose-950/20 border border-slate-800 hover:border-rose-500/40 transition active:scale-95 whitespace-nowrap shadow-sm"
              title="Eliminar todos los widgets del lienzo"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Limpiar Lienzo</span>
              <span className="sm:hidden">Limpiar</span>
            </button>
          )}

          <button
            onClick={onOpenAddWidgetModal}
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs px-3 py-1 rounded-xl shadow-md shadow-emerald-500/20 active:scale-95 transition whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span className="hidden sm:inline">+ Nuevo Widget</span>
            <span className="sm:hidden">+ Widget</span>
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
