import React from 'react'
import { Radio, Cpu, RefreshCw, Activity, Plus } from 'lucide-react'

export function Header({
  deviceId,
  status,
  deviceStatus = 'waiting',
  lastSeenText = 'Sin datos',
  packetCount,
  onOpenDeviceModal,
}) {
  const renderStatusBadge = () => {
    switch (deviceStatus) {
      case 'online':
        return (
          <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-mono font-medium px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>En línea</span>
          </span>
        )
      case 'idle':
        return (
          <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-mono font-medium px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="hidden sm:inline">Inactivo ({lastSeenText})</span>
            <span className="sm:hidden">{lastSeenText}</span>
          </span>
        )
      case 'offline':
        return (
          <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-mono font-medium px-2 py-0.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            <span className="hidden sm:inline">Fuera de línea ({lastSeenText})</span>
            <span className="sm:hidden">Offline</span>
          </span>
        )
      case 'waiting':
        return (
          <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-mono font-medium px-2 py-0.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="hidden sm:inline">Esperando señal</span>
            <span className="sm:hidden">Esperando</span>
          </span>
        )
      default:
        return (
          <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-mono font-medium px-2 py-0.5 rounded-lg bg-slate-800 text-slate-400 border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Desconectado</span>
          </span>
        )
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
        <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 rounded-xl px-2.5 py-1 shadow-inner">
          <Cpu className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="text-xs font-mono font-semibold text-slate-200">
            {deviceId || '---'}
          </span>
          {renderStatusBadge()}
          <button
            onClick={onOpenDeviceModal}
            className="p-1 hover:bg-slate-700 rounded-md text-slate-400 hover:text-white transition"
            title="Cambiar Dispositivo"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>

        {/* Packets count */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/40 px-2.5 py-1 rounded-lg border border-slate-800">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>{packetCount} msgs</span>
        </div>
      </div>
    </header>
  )
}
