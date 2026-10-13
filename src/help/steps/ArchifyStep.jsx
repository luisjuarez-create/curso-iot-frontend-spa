import React from 'react'
import { ExternalLink } from 'lucide-react'

export function ArchifyStep({ src, title, present = true, theme = 'dark' }) {
  // ?theme= tiene prioridad sobre el tema del sistema; ?present=1 entra directo al modo presentación.
  const params = new URLSearchParams({ theme })
  if (present) params.set('present', '1')
  const url = `${src}?${params}`

  return (
    <div className="flex-1 flex flex-col min-h-0 p-2 sm:p-3 gap-2">
      <div className="flex justify-end">
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-lg text-slate-300 hover:text-white bg-slate-800/70 hover:bg-slate-800 border border-slate-700/70 transition"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Abrir en pestaña nueva
        </a>
      </div>
      <iframe
        key={url}
        src={url}
        title={title}
        className="flex-1 w-full min-h-[360px] rounded-xl border border-slate-800 bg-slate-950"
      />
    </div>
  )
}
