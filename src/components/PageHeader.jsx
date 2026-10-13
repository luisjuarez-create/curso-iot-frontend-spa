import React from 'react'
import { LayoutDashboard } from 'lucide-react'
import { BrandLogos } from './BrandLogos.jsx'

// Encabezado de páginas secundarias. En lg+ el título se muestra en el panel lateral (PageTitle).
export function PageHeader({ icon: Icon, title, onExit }) {
  return (
    <header className="border-b border-slate-800 bg-slate-900/95 shrink-0 flex flex-col lg:flex-row lg:items-center lg:h-16 lg:px-6 lg:gap-6">
      {/* Logos institucionales: siempre visibles (fila propia en móvil) */}
      <div className="px-3 py-2 border-b border-slate-800/70 lg:border-0 lg:p-0 lg:flex-1 lg:min-w-0 lg:max-w-[700px]">
        <BrandLogos className="w-full max-w-[520px] mx-auto lg:max-w-none lg:mx-0" />
      </div>

      <div className="h-12 px-3 sm:px-6 flex items-center justify-between gap-3 lg:h-auto lg:p-0 lg:ml-auto lg:shrink-0">
        <div className="flex items-center gap-2.5 min-w-0 lg:hidden">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-600 to-cyan-500 flex items-center justify-center shrink-0">
            <Icon className="w-3.5 h-3.5 text-white" />
          </div>
          <h1 className="font-bold text-sm tracking-tight truncate">{title}</h1>
        </div>
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition shrink-0"
        >
          <LayoutDashboard className="w-4 h-4 text-emerald-400" />
          <span className="hidden sm:inline">Volver al dashboard</span>
          <span className="sm:hidden">Dashboard</span>
        </button>
      </div>
    </header>
  )
}

export function PageTitle({ icon: Icon, title, subtitle, className = '' }) {
  return (
    <div className={`hidden lg:flex items-center gap-2.5 ${className}`}>
      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-cyan-500 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div className="min-w-0">
        <h1 className="font-bold text-sm tracking-tight truncate">{title}</h1>
        <p className="text-[11px] text-slate-400 truncate">{subtitle}</p>
      </div>
    </div>
  )
}
