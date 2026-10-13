import React from 'react'
import {
  Radio, Cpu, Monitor, Database, Send, Inbox, ArrowRight, Newspaper, Hash, Terminal,
} from 'lucide-react'
import { Section } from '../Section.jsx'
import { MQTT_CLIENT_HASH } from '../hashRoute.js'

const ROLES = [
  {
    icon: Radio,
    title: 'Broker',
    text: 'El servidor central. Recibe cada mensaje y lo entrega a quien lo pidió. En el curso es Mosquitto.',
    tone: 'emerald',
  },
  {
    icon: Send,
    title: 'Publicador',
    text: 'Un cliente que envía mensajes a un tópico. Ej.: la placa publica su temperatura.',
    tone: 'cyan',
  },
  {
    icon: Inbox,
    title: 'Suscriptor',
    text: 'Un cliente que pide recibir lo que llegue a un tópico. Ej.: el dashboard.',
    tone: 'cyan',
  },
]

const SUBSCRIBERS = [
  { icon: Monitor, name: 'Dashboard' },
  { icon: Terminal, name: 'Cliente MQTT' },
  { icon: Database, name: 'Base de datos' },
]

const ANALOGY = [
  { life: 'El periódico', mqtt: 'Broker', note: 'Recibe todas las noticias y las reparte.' },
  { life: 'El reportero', mqtt: 'Publicador', note: 'Entrega su nota al periódico, no a cada lector.' },
  { life: 'La sección (deportes, clima…)', mqtt: 'Tópico', note: 'devices/unoq-0fb74d07/telemetry' },
  { life: 'El lector suscrito a una sección', mqtt: 'Suscriptor', note: 'Solo recibe lo de la sección que pidió.' },
  { life: 'Llega un lector nuevo', mqtt: 'Nuevo suscriptor', note: 'El reportero no cambia nada; el periódico se encarga.' },
]

const TOPIC_EXAMPLES = [
  { filter: 'devices/unoq-0fb74d07/telemetry', meaning: 'Solo la telemetría de esa placa' },
  { filter: 'devices/unoq-0fb74d07/#', meaning: 'Todo lo de esa placa: telemetry, status y cmd' },
  { filter: 'devices/+/telemetry', meaning: 'La telemetría de todas las placas' },
  { filter: 'devices/#', meaning: 'Absolutamente todo lo que cuelga de devices/' },
]

function RoleCard({ icon: Icon, title, text, tone }) {
  const color = tone === 'emerald' ? 'text-emerald-400' : 'text-cyan-400'
  return (
    <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/70">
      <Icon className={`w-5 h-5 ${color}`} />
      <span className="block text-sm font-semibold text-slate-100 mt-2">{title}</span>
      <span className="block text-xs text-slate-400 mt-1 leading-snug">{text}</span>
    </div>
  )
}

function FlowBox({ icon: Icon, title, children, highlight = false }) {
  return (
    <div
      className={`flex-1 p-3 rounded-xl border text-center ${
        highlight ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-slate-800 bg-slate-900/70'
      }`}
    >
      <Icon className={`w-6 h-6 mx-auto ${highlight ? 'text-emerald-400' : 'text-cyan-400'}`} />
      <span className="block text-xs font-semibold text-slate-100 mt-2">{title}</span>
      {children}
    </div>
  )
}

function FlowArrow({ label }) {
  return (
    <div className="flex flex-col items-center justify-center shrink-0 gap-0.5 py-1 sm:py-0">
      <ArrowRight className="w-4 h-4 text-slate-500 rotate-90 sm:rotate-0" />
      <span className="text-[10px] text-slate-500">{label}</span>
    </div>
  )
}

export function MqttIntroStep() {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-7">
      <p className="text-sm text-slate-300 leading-relaxed">
        <span className="font-semibold text-emerald-300">MQTT</span> es un protocolo de mensajería muy ligero que
        viaja sobre TCP/IP. Está pensado para dispositivos pequeños y redes inestables: cada mensaje lleva muy poca
        información extra y la conexión se mantiene abierta para enviar y recibir al instante.
      </p>

      <Section icon={Cpu} title="Todos son clientes">
        <p className="text-sm text-slate-300 leading-relaxed">
          En MQTT los dispositivos nunca se hablan directamente. Tu placa, el dashboard y el cliente MQTT de esta página
          son <span className="font-semibold text-slate-100">clientes</span>: cada uno abre una conexión con el{' '}
          <span className="font-semibold text-emerald-300">broker</span> y solo hablan con él.
        </p>
        <div className="grid sm:grid-cols-3 gap-2.5">
          {ROLES.map((role) => <RoleCard key={role.title} {...role} />)}
        </div>
        <p className="text-xs text-slate-400">
          Un mismo cliente puede hacer ambas cosas: la placa publica su telemetría y está suscrita a{' '}
          <span className="font-mono text-slate-200">cmd</span> para recibir órdenes; el dashboard se suscribe a la
          telemetría y publica los comandos de los widgets de control.
        </p>
      </Section>

      <Section icon={Send} title="Publicador / suscriptor">
        <div className="flex flex-col sm:flex-row sm:items-stretch gap-2">
          <FlowBox icon={Cpu} title="Placa (publicador)">
            <span className="block text-[11px] text-slate-400 mt-1 leading-snug">Publica una vez</span>
          </FlowBox>
          <FlowArrow label="publica" />
          <FlowBox icon={Radio} title="Broker" highlight>
            <span className="block font-mono text-[10px] text-cyan-300 mt-1">
              devices/<wbr />&lt;id&gt;/<wbr />telemetry
            </span>
          </FlowBox>
          <FlowArrow label="entrega" />
          <div className="flex-1 p-3 rounded-xl border border-slate-800 bg-slate-900/70 space-y-1.5">
            <span className="block text-xs font-semibold text-slate-100 text-center">Suscriptores</span>
            {SUBSCRIBERS.map(({ icon: Icon, name }) => (
              <div key={name} className="flex items-center gap-2 text-[11px] text-slate-300">
                <Icon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                {name}
              </div>
            ))}
          </div>
        </div>
        <ul className="text-sm text-slate-300 leading-relaxed list-disc pl-5 space-y-1">
          <li>El publicador no sabe quién lee sus datos, ni cuántos son.</li>
          <li>Un solo mensaje llega a todos los suscriptores de ese tópico.</li>
          <li>Agregar una pantalla o una base de datos no obliga a cambiar el código de la placa.</li>
        </ul>
      </Section>

      <Section icon={Newspaper} title="Una analogía: el periódico">
        <p className="text-sm text-slate-300 leading-relaxed">
          Un reportero no le lleva su nota a cada lector: la entrega al periódico, y el periódico la hace llegar a todos
          los que están suscritos a esa sección. MQTT funciona igual.
        </p>
        <div className="rounded-xl border border-slate-800 overflow-hidden divide-y divide-slate-800">
          {ANALOGY.map((row) => (
            <div key={row.mqtt} className="grid grid-cols-[1fr_auto] md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.7fr)_minmax(0,1.6fr)] gap-x-3 gap-y-0.5 px-3.5 py-2.5 bg-slate-900/50">
              <span className="text-xs text-slate-300">{row.life}</span>
              <span className="text-xs font-semibold text-emerald-300 text-right md:text-left">{row.mqtt}</span>
              <span className="col-span-2 md:col-span-1 text-[11px] text-slate-500 [overflow-wrap:anywhere]">{row.note}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section icon={Hash} title="Tópicos">
        <p className="text-sm text-slate-300 leading-relaxed">
          El tópico es la dirección del mensaje. Se escribe por niveles separados con{' '}
          <span className="font-mono text-slate-200">/</span>, sin espacios y distinguiendo mayúsculas. Al suscribirte
          puedes usar comodines: <span className="font-mono text-cyan-300">+</span> reemplaza un nivel y{' '}
          <span className="font-mono text-cyan-300">#</span> todos los niveles que siguen.
        </p>
        <div className="rounded-xl border border-slate-800 overflow-hidden divide-y divide-slate-800">
          {TOPIC_EXAMPLES.map((t) => (
            <div key={t.filter} className="grid md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-1 md:gap-3 px-3.5 py-2.5 bg-slate-900/50">
              <span className="font-mono text-[13px] text-cyan-300 [overflow-wrap:anywhere]">{t.filter}</span>
              <span className="text-xs text-slate-300">{t.meaning}</span>
            </div>
          ))}
        </div>
        <a
          href={MQTT_CLIENT_HASH}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition"
        >
          <Terminal className="w-3.5 h-3.5" />
          Pruébalo en el Cliente MQTT
        </a>
      </Section>
    </div>
  )
}
