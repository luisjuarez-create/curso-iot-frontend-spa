import React from 'react'
import { Cpu, Activity, BookOpen } from 'lucide-react'
import { BrandLogos } from './BrandLogos.jsx'

export function Header({
  deviceId,
  status,
  deviceStatus = 'waiting',
  lastSeenText = 'Sin datos',
  packetCount,
  onOpenDeviceModal,
  onOpenHelp,
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
    <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur z-20 shrink-0 flex flex-col lg:flex-row lg:items-center lg:h-16 lg:px-6 lg:gap-6">
      {/* Logos institucionales: siempre visibles (fila propia en móvil) */}
      <div className="px-3 py-2 border-b border-slate-800/70 lg:border-0 lg:p-0 lg:flex-1 lg:min-w-0 lg:max-w-[700px]">
        <BrandLogos className="w-full max-w-[520px] mx-auto lg:max-w-none lg:mx-0" />
      </div>

      {/* Device Badge & Info */}
      <div className="h-12 px-3 flex items-center justify-between gap-2 lg:h-auto lg:p-0 lg:ml-auto lg:shrink-0">
        <button
          onClick={onOpenDeviceModal}
          className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 rounded-xl px-2.5 py-1 shadow-inner text-slate-200 hover:bg-slate-700/80 hover:border-emerald-500/50 hover:text-white active:scale-[0.98] transition cursor-pointer min-w-0"
          title="Cambiar Tópico"
        >
          <Cpu className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="text-xs font-mono font-semibold truncate max-w-[150px] sm:max-w-[260px] lg:max-w-[140px] xl:max-w-[220px]">
            {deviceId || '---'}
          </span>
          {renderStatusBadge()}
        </button>

        <div className="flex items-center gap-2 shrink-0">
          {/* Packets count (en lg se muestra en el sidebar por falta de espacio) */}
          <div className="hidden sm:flex lg:hidden xl:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/40 px-2.5 py-1 rounded-lg border border-slate-800">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>{packetCount} msgs</span>
          </div>

          <button
            onClick={onOpenHelp}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-700/80 px-2.5 py-1.5 rounded-lg border border-slate-700/80 hover:border-emerald-500/50 transition"
            title="Material de apoyo: código Arduino y diagramas"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline lg:hidden xl:inline">Ayuda</span>
          </button>
        </div>
      </div>
    </header>
  )
}
