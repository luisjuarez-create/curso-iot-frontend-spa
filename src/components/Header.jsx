import React from 'react'
import { Activity, Plus, RefreshCw, Radio, Cpu, Layers } from 'lucide-react'

export function Header({
  deviceId,
  status,
  packetCount,
  onOpenDeviceModal,
  onOpenAddWidgetModal,
  onOpenMobileDrawer,
  variablesCount = 0,
}) {
  const getStatusBadge = () => {
    switch (status) {
      case 'connected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="hidden sm:inline">En línea</span>
          </span>
        )
      case 'connecting':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            <span className="hidden sm:inline">Conectando...</span>
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
            <span className="hidden sm:inline">Desconectado</span>
          </span>
        )
    }
  }

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur px-3 sm:px-6 flex items-center justify-between z-20">
      {/* Brand & Title */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-bold shrink-0">
          <Radio className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="font-bold text-slate-100 text-sm sm:text-base tracking-tight">CIDESI IoT</h1>
            <span className="hidden sm:inline text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              Live
            </span>
          </div>
          <p className="hidden sm:block text-xs text-slate-400">Plataforma de Telemetría</p>
        </div>
      </div>

      {/* Center Device Badge & Info */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Device selector pill */}
        <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-800/80 border border-slate-700/80 rounded-xl px-2.5 sm:px-3 py-1 shadow-inner">
          <Cpu className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <div className="flex flex-col">
            <span className="hidden sm:block text-[9px] text-slate-400 font-medium leading-none">Dispositivo</span>
            <span className="text-[11px] sm:text-xs font-mono font-semibold text-slate-200 leading-tight">
              {deviceId || '---'}
            </span>
          </div>
          <button
            onClick={onOpenDeviceModal}
            className="ml-1 p-1 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition"
            title="Cambiar Dispositivo"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>

        {/* Status Badge */}
        {getStatusBadge()}

        {/* Packets count */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/40 px-2.5 py-1 rounded-lg border border-slate-800">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>{packetCount} msgs</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Boton para ver variables en tablet/mobile header */}
        <button
          onClick={onOpenMobileDrawer}
          className="lg:hidden flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-2.5 py-1.5 rounded-xl border border-slate-700 transition"
        >
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[11px] font-mono">{variablesCount}</span>
        </button>

        <button
          onClick={onOpenAddWidgetModal}
          className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span className="hidden sm:inline">Nuevo Widget</span>
          <span className="sm:hidden">Widget</span>
        </button>
      </div>
    </header>
  )
}
