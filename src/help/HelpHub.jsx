import React, { useEffect } from 'react'
import { ArrowLeft, ArrowRight, BookOpen, LayoutDashboard } from 'lucide-react'
import { GUIDES, ALL_STEPS, findStep } from './guides.js'
import { helpHash, navigate } from './hashRoute.js'
import { ArchifyStep } from './steps/ArchifyStep.jsx'

export function HelpHub({ guideId, stepId, onExit }) {
  const currentIndex = findStep(guideId, stepId)
  const { guide, step } = ALL_STEPS[currentIndex]
  const prev = ALL_STEPS[currentIndex - 1]
  const next = ALL_STEPS[currentIndex + 1]
  const stepNumber = guide.steps.indexOf(step) + 1

  const goTo = (entry) => entry && navigate(helpHash(entry.guide.id, entry.step.id))

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest?.('input, textarea, select')) return
      if (e.key === 'ArrowRight') goTo(next)
      if (e.key === 'ArrowLeft') goTo(prev)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const StepComponent = step.kind === 'component' ? step.component : null

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Top bar */}
      <header className="h-14 sm:h-16 border-b border-slate-800 bg-slate-900/95 px-3 sm:px-6 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-cyan-500 flex items-center justify-center shrink-0">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="font-bold text-sm sm:text-base tracking-tight truncate">Material de apoyo</h1>
            <p className="hidden sm:block text-xs text-slate-400">Guías y diagramas del curso</p>
          </div>
        </div>
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition shrink-0"
        >
          <LayoutDashboard className="w-4 h-4 text-emerald-400" />
          <span>Volver al dashboard</span>
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Navigation menu (desktop) */}
        <nav className="hidden md:flex w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-900/60 overflow-y-auto p-3 gap-4">
          {GUIDES.map((g) => (
            <div key={g.id}>
              <h2 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-2">{g.title}</h2>
              <p className="text-[11px] text-slate-500 px-2 mt-0.5 mb-2 leading-snug">{g.description}</p>
              <ol className="space-y-1">
                {g.steps.map((s, i) => {
                  const active = g.id === guide.id && s.id === step.id
                  return (
                    <li key={s.id}>
                      <a
                        href={helpHash(g.id, s.id)}
                        className={`flex items-center gap-2.5 px-2 py-2 rounded-lg text-xs transition ${
                          active
                            ? 'bg-emerald-500/10 border border-emerald-500/40 text-emerald-300'
                            : 'border border-transparent text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                            active ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {i + 1}
                        </span>
                        {s.title}
                      </a>
                    </li>
                  )
                })}
              </ol>
            </div>
          ))}
        </nav>

        {/* Content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="px-4 sm:px-6 py-3 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
            <div className="min-w-0">
              <span className="text-[11px] text-slate-400">
                {guide.title} · Paso {stepNumber} de {guide.steps.length}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-100 truncate">{step.title}</h2>
            </div>

            {/* Navigation menu (mobile) */}
            <select
              value={`${guide.id}/${step.id}`}
              onChange={(e) => {
                const [g, s] = e.target.value.split('/')
                navigate(helpHash(g, s))
              }}
              className="md:hidden max-w-[45%] bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-200"
            >
              {GUIDES.map((g) => (
                <optgroup key={g.id} label={g.title}>
                  {g.steps.map((s, i) => (
                    <option key={s.id} value={`${g.id}/${s.id}`}>
                      {i + 1}. {s.title}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div
            key={`${guide.id}/${step.id}`}
            className={`flex-1 min-h-0 ${StepComponent ? 'overflow-y-auto' : 'flex flex-col overflow-y-auto'}`}
          >
            {StepComponent ? <StepComponent /> : <ArchifyStep src={step.src} title={step.title} present={step.present} />}
          </div>

          {/* Prev / Next */}
          <footer className="h-14 border-t border-slate-800 bg-slate-900/80 px-3 sm:px-6 flex items-center justify-between gap-2 shrink-0">
            <button
              onClick={() => goTo(prev)}
              disabled={!prev}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition disabled:opacity-30 disabled:pointer-events-none min-w-0"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <span className="truncate">{prev ? prev.step.title : 'Anterior'}</span>
            </button>

            <div className="flex items-center gap-1.5">
              {ALL_STEPS.map((entry, i) => (
                <span
                  key={`${entry.guide.id}-${entry.step.id}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === currentIndex ? 'w-5 bg-emerald-400' : 'w-1.5 bg-slate-700'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => goTo(next)}
              disabled={!next}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 transition disabled:opacity-30 disabled:pointer-events-none min-w-0"
            >
              <span className="truncate">{next ? next.step.title : 'Siguiente'}</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </footer>
        </main>
      </div>
    </div>
  )
}
