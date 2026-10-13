import React, { useState } from 'react'
import { Copy, Check, ChevronDown } from 'lucide-react'

export function CodeBlock({ code, language, title, collapsible = false }) {
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(!collapsible)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
      <div
        className={`flex items-center justify-between gap-2 px-3 py-1.5 bg-slate-900/80 ${open ? 'border-b border-slate-800' : ''}`}
      >
        <span className="text-[11px] font-mono text-slate-400 truncate">{title || language}</span>
        <div className="flex items-center gap-1 shrink-0">
          {collapsible && (
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md text-emerald-300 hover:text-emerald-200 hover:bg-slate-800 transition"
            >
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
              {open ? 'Ocultar código' : 'Ver código'}
            </button>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copiado' : 'Copiar'}
          </button>
        </div>
      </div>
      {open && (
        <pre className="p-3.5 overflow-x-auto text-[12px] leading-relaxed font-mono text-slate-200">
          <code>{code}</code>
        </pre>
      )}
    </div>
  )
}
