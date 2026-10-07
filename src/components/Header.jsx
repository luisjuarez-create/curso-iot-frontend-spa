import React from 'react'
import { Radio, Cpu, RefreshCw, Activity, Plus } from 'lucide-react'

export function Header({
  deviceId,
  status,
  packetCount,
  onOpenDeviceModal,
  onOpenAddWidgetModal,
}) {
  const getStatusDot = () => {
    switch (status) {
      case 'connected':
        return <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      case 'connecting':
        return <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
      default:
        return <span className="w-2 h-2 rounded-full bg-rose-400" />
    }
  }

  return (
    <header className="h-14 sm:h-16 border-b border-slate-800 bg-slate-900/95 backdrop-blur px-3 sm:px-6 flex items-center justify-between z-20 shrink-0">
      {/* Brand & Title (Ultra compacto en móvil) */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-bold shrink-0">
          <Radio className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="font-bold text-slate-100 text-sm sm:text-base tracking-tight">CIDESI IoT</h1>
            <span className="hidden sm:inline text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              Live
            </span>
          </div>
          <p className="hidden md:block text-xs text-slate-400">Plataforma de Telemetría</p>
        </div>
      </div>

      {/* Center Device Badge & Info */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/80 rounded-xl px-2.5 py-1 shadow-inner">
          <Cpu className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-mono font-semibold text-slate-200">
              {deviceId || '---'}
            </span>
            {getStatusDot()}
          </div>
          <button
            onClick={onOpenDeviceModal}
            className="ml-1 p-0.5 hover:bg-slate-700 rounded-md text-slate-400 hover:text-white transition"
            title="Cambiar Dispositivo"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>

        {/* Packets count (Solo Desktop) */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/40 px-2.5 py-1 rounded-lg border border-slate-800">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>{packetCount} msgs</span>
        </div>
      </div>

      {/* Action Buttons (En móvil se eliminan duplicados; solo botón en desktop) */}
      <div className="hidden lg:flex items-center gap-2">
        <button
          onClick={onOpenAddWidgetModal}
          className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Nuevo Widget</span>
        </button>
      </div>
    </header>
  )
}
