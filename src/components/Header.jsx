import React from 'react'
import { Activity, Plus, RefreshCw, Radio, Cpu, Layers } from 'lucide-react'

export function Header({
  deviceId,
  status,
  packetCount,
  onOpenDeviceModal,
  onOpenAddWidgetModal,
}) {
  const getStatusBadge = () => {
    switch (status) {
      case 'connected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            En línea
          </span>
        )
      case 'connecting':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            Conectando...
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
            Desconectado
          </span>
        )
    }
  }

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur px-6 flex items-center justify-between z-20">
      {/* Brand & Title */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-bold">
          <Radio className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-slate-100 text-base tracking-tight">CIDESI IoT</h1>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              Live Monitor
            </span>
          </div>
          <p className="text-xs text-slate-400">Plataforma de Monitoreo y Telemetría</p>
        </div>
      </div>

      {/* Center Device Badge & Info */}
      <div className="flex items-center gap-3">
        {/* Device selector pill */}
        <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-1.5 shadow-inner">
          <Cpu className="w-4 h-4 text-emerald-400" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-medium leading-none">Dispositivo Activo</span>
            <span className="text-xs font-mono font-semibold text-slate-200 leading-tight">
              {deviceId || 'No seleccionado'}
            </span>
          </div>
          <button
            onClick={onOpenDeviceModal}
            className="ml-2 p-1 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition"
            title="Cambiar Dispositivo"
          >
            <RefreshCw className="w-3.5 h-3.5" />
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
      <div className="flex items-center gap-2.5">
        <button
          onClick={onOpenAddWidgetModal}
          className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-semibold text-xs px-3.5 py-2 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Agregar Widget</span>
        </button>
      </div>
    </header>
  )
}
