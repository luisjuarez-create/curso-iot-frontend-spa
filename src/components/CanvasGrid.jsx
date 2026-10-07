import React from 'react'
import { NumericWidget } from './NumericWidget.jsx'
import { Plus, LayoutGrid, Sparkles, HelpCircle } from 'lucide-react'

export function CanvasGrid({
  widgets,
  variables,
  onUpdateWidget,
  onDeleteWidget,
  onOpenAddWidgetModal,
  onClearAll,
}) {
  return (
    <main className="flex-1 bg-slate-950 p-6 overflow-y-auto h-[calc(100vh-4rem)]">
      {/* Canvas Top Bar */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-900">
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold text-slate-200">Lienzo de Monitoreo</h2>
          <span className="text-xs text-slate-500 font-mono">
            ({widgets.length} {widgets.length === 1 ? 'widget' : 'widgets'})
          </span>
        </div>

        {widgets.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={onClearAll}
              className="text-xs text-slate-400 hover:text-rose-400 transition px-2 py-1"
            >
              Limpiar Lienzo
            </button>
            <button
              onClick={onOpenAddWidgetModal}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-xl border border-slate-700 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Nuevo Widget
            </button>
          </div>
        )}
      </div>

      {/* Grid or Empty State */}
      {widgets.length === 0 ? (
        <div className="h-[75vh] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-900 rounded-3xl">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 shadow-xl shadow-emerald-500/5">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-100">Lienzo de Monitoreo Vacío</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md leading-relaxed">
            Comienza agregando un widget con el botón inferior o superior. Luego arrastra cualquier
            variable detectada desde el panel izquierdo hacia el widget para visualizarla en tiempo real.
          </p>

          <button
            onClick={onOpenAddWidgetModal}
            className="mt-6 flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Agregar Primer Widget
          </button>

          {/* Quick Guide */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl text-left">
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold mb-2">
                1
              </span>
              <h4 className="text-xs font-semibold text-slate-200">Publica Telemetría</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                El sensor envía datos al tópico <code className="text-emerald-400">devices/{'{id}'}/telemetry</code>.
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold mb-2">
                2
              </span>
              <h4 className="text-xs font-semibold text-slate-200">Crea tus Widgets</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Añade tarjetas numéricas y ajústalas en el grid interactivo.
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold mb-2">
                3
              </span>
              <h4 className="text-xs font-semibold text-slate-200">Drag & Drop</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Arrastra la variable deseada al widget para vincularla al instante.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* The Responsive Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-fr">
          {widgets.map((widget) => (
            <NumericWidget
              key={widget.id}
              widget={widget}
              variables={variables}
              onUpdateWidget={onUpdateWidget}
              onDeleteWidget={onDeleteWidget}
            />
          ))}
        </div>
      )}
    </main>
  )
}
