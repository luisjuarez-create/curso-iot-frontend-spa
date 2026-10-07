import React from 'react'
import { WidgetContainer } from './WidgetContainer.jsx'
import { Plus, LayoutGrid, Sparkles } from 'lucide-react'

export function CanvasGrid({
  widgets,
  variables,
  onUpdateWidget,
  onDeleteWidget,
  onReorderWidgets,
  onOpenAddWidgetModal,
  onOpenSettings,
  onClearAll,
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

  const handleMove = (id, direction) => {
    const currentIndex = widgets.findIndex((w) => w.id === id)
    if (currentIndex === -1) return
    const targetIndex = currentIndex + direction
    if (targetIndex < 0 || targetIndex >= widgets.length) return

    const updated = [...widgets]
    const [moved] = updated.splice(currentIndex, 1)
    updated.splice(targetIndex, 0, moved)
    onReorderWidgets(updated)
  }

  return (
    <main className="flex-1 w-full lg:w-[80%] bg-slate-950 p-6 overflow-y-auto h-[calc(100vh-4rem)]">
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
          <button
            onClick={onOpenAddWidgetModal}
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            Nuevo Widget
          </button>
        </div>
      </div>

      {/* Grid or Empty State */}
      {widgets.length === 0 ? (
        <div className="h-[72vh] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-900 rounded-3xl">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 shadow-xl shadow-emerald-500/5">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-100">Lienzo Listo para Widgets</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md leading-relaxed">
            Puedes agregar 6 tipos de visualizaciones (Numérico, Gráfica de Líneas, Medidor Gauge,
            Barra de Nivel, Alerta LED y Barras Históricas). Redimensiona arrastrando la esquina
            inferior derecha hacia los lados y abajo estilo AWS CloudWatch.
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
        /* The Responsive Grid with Drag & Drop Reordering */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-fr">
          {widgets.map((widget) => (
            <WidgetContainer
              key={widget.id}
              widget={widget}
              variables={variables}
              onUpdateWidget={onUpdateWidget}
              onDeleteWidget={onDeleteWidget}
              onReorderWidgets={handleReorder}
              onMoveWidget={handleMove}
              onOpenSettings={onOpenSettings}
            />
          ))}
        </div>
      )}
    </main>
  )
}
