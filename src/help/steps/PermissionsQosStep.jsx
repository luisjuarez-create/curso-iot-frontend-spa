import React from 'react'
import { Cpu, Monitor, TriangleAlert, ShieldCheck, PenLine, Eye, Lock, Send } from 'lucide-react'
import { Section } from '../Section.jsx'

const ROLES = [
  { icon: PenLine, who: 'Cada dispositivo', rule: 'Solo escribe en su propio tópico' },
  { icon: Eye, who: 'Dashboard', rule: 'Solo lee, no puede publicar' },
  { icon: Lock, who: 'Sin credencial', rule: 'No entra al broker' },
]

const QOS_LEVELS = [
  {
    level: 0,
    name: 'A lo más una vez',
    text: 'Se envía y no se confirma. Rápido, pero si la red falla el mensaje se pierde.',
    use: 'Lecturas frecuentes: si se pierde una, llega otra en segundos.',
  },
  {
    level: 1,
    name: 'Al menos una vez',
    text: 'El broker confirma que lo recibió; si no, se reenvía. Puede llegar repetido.',
    use: 'Estado ONLINE/OFFLINE, alarmas.',
  },
  {
    level: 2,
    name: 'Exactamente una vez',
    text: 'Confirmación en varios pasos. Nunca se duplica, pero es el más lento.',
    use: 'Órdenes que no deben repetirse, como un cobro o abrir una válvula.',
  },
]

function DeviceChip({ name, value, tone = 'slate' }) {
  const tones = {
    slate: 'border-slate-700 text-slate-200',
    red: 'border-red-500/50 text-red-200',
    emerald: 'border-emerald-500/40 text-emerald-200',
  }
  return (
    <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border bg-slate-950/60 text-xs ${tones[tone]}`}>
      <Cpu className="w-3.5 h-3.5 shrink-0" />
      <span className="truncate">{name}</span>
      {value && <span className="ml-auto font-mono text-slate-400">{value}</span>}
    </div>
  )
}

function Topic({ children, tone = 'cyan' }) {
  const color = tone === 'red' ? 'text-red-300' : 'text-cyan-300'
  return <span className={`block font-mono text-[11px] ${color} break-all`}>{children}</span>
}

export function PermissionsQosStep() {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-7">
      <p className="text-sm text-slate-300 leading-relaxed">
        En el curso el broker está abierto para que conectarse sea sencillo. En un sistema real
        se controla quién puede escribir y quién puede leer en cada tópico.
      </p>

      <Section icon={TriangleAlert} title="¿Qué pasa si dos dispositivos usan el mismo tópico?">
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl border border-red-500/30 bg-red-500/5 space-y-2.5">
            <span className="text-xs font-bold text-red-300 uppercase tracking-wide">Sin permisos</span>
            <DeviceChip name="ESP32 de Juan" value="24.3 °C" tone="red" />
            <DeviceChip name="ESP32 de Ana" value="18.9 °C" tone="red" />
            <div className="pl-1">
              <span className="text-[11px] text-slate-400">ambos publican en</span>
              <Topic tone="red">devices/sala-1/telemetry</Topic>
            </div>
            <div className="flex items-start gap-2 text-xs text-slate-300">
              <Monitor className="w-4 h-4 text-red-300 shrink-0 mt-0.5" />
              <span>El dashboard muestra 24.3, luego 18.9, luego 24.3… Un dato sobrescribe al otro y ya no sabes cuál es el real.</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-2.5">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wide">Con permisos</span>
            <div className="space-y-1">
              <DeviceChip name="ESP32 de Juan" value="24.3 °C" tone="emerald" />
              <Topic>devices/juan/telemetry</Topic>
            </div>
            <div className="space-y-1">
              <DeviceChip name="ESP32 de Ana" value="18.9 °C" tone="emerald" />
              <Topic>devices/ana/telemetry</Topic>
            </div>
            <div className="flex items-start gap-2 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
              <span>Si Ana intenta escribir en el tópico de Juan, el broker lo rechaza.</span>
            </div>
          </div>
        </div>
      </Section>

      <Section icon={ShieldCheck} title="Lectura y escritura por separado">
        <div className="grid sm:grid-cols-3 gap-2.5">
          {ROLES.map(({ icon: Icon, who, rule }) => (
            <div key={who} className="p-3 rounded-xl border border-slate-800 bg-slate-900/70">
              <Icon className="w-5 h-5 text-cyan-400" />
              <span className="block text-sm font-semibold text-slate-100 mt-2">{who}</span>
              <span className="block text-xs text-slate-400 mt-1">{rule}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400">
          Estas reglas se configuran en el propio broker con un usuario y contraseña por dispositivo.
          Mientras tanto, usa un identificador único para que nadie más publique en tu tópico por accidente.
        </p>
      </Section>

      <Section icon={Send} title="QoS: qué tan seguro es que llegue el mensaje">
        <div className="grid sm:grid-cols-3 gap-2.5">
          {QOS_LEVELS.map((q) => (
            <div key={q.level} className="p-3 rounded-xl border border-slate-800 bg-slate-900/70 flex flex-col">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-bold text-sm flex items-center justify-center">
                  {q.level}
                </span>
                <span className="text-sm font-semibold text-slate-100">{q.name}</span>
              </div>
              <span className="block text-xs text-slate-300 mt-2 leading-snug">{q.text}</span>
              <span className="block text-[11px] text-slate-500 mt-auto pt-2">Úsalo en: {q.use}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400">
          En el sketch del curso la telemetría viaja con QoS 0 y el aviso OFFLINE (última voluntad) con QoS 1.
        </p>
      </Section>
    </div>
  )
}
