import React from 'react'

export function Section({ icon: Icon, title, children }) {
  return (
    <section className="space-y-2.5">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-100">
        <Icon className="w-4 h-4 text-emerald-400" />
        {title}
      </h3>
      {children}
    </section>
  )
}
