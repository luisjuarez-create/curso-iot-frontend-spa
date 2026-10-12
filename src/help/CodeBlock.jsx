import React, { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export function CodeBlock({ code, language, title }) {
  const [copied, setCopied] = useState(false)

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
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-800 bg-slate-900/80">
        <span className="text-[11px] font-mono text-slate-400">{title || language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copiado' : 'Copiar'}
        </button>
      </div>
      <pre className="p-3.5 overflow-x-auto text-[12px] leading-relaxed font-mono text-slate-200">
        <code>{code}</code>
      </pre>
    </div>
  )
}
