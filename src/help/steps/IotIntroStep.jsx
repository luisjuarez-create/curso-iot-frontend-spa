import React from 'react'
import {
  Thermometer, Cpu, Wifi, Server, Monitor, ArrowRight,
  Radio, Eye, Power, Layers, Network, Factory, Plug,
} from 'lucide-react'
import { Section } from '../Section.jsx'

const FLOW = [
  { icon: Thermometer, title: 'Sensor', text: 'Mide temperatura, humedad, luz…' },
  { icon: Cpu, title: 'Microcontrolador', text: 'Lee el sensor y arma el mensaje' },
  { icon: Wifi, title: 'Red', text: 'Lleva el dato a internet' },
  { icon: Server, title: 'Servidor', text: 'Recibe los datos y los entrega a quien los necesita' },
  { icon: Monitor, title: 'Aplicación', text: 'Dashboard, alertas, base de datos' },
]

const EMBEDDED_ROLES = [
  { icon: Eye, title: 'Percibe', text: 'Lee sensores: temperatura, presencia, nivel de un tanque.' },
  { icon: Power, title: 'Actúa', text: 'Controla actuadores: un LED, un motor, una válvula.' },
  { icon: Radio, title: 'Se comunica', text: 'Envía y recibe datos por WiFi, Bluetooth, LoRa o celular.' },
]

const PROTOCOL_GROUPS = [
  {
    icon: Plug,
    title: 'Conectan el dispositivo a la red',
    items: [
      { name: 'WiFi', text: 'Casa u oficina, buena velocidad' },
      { name: 'Bluetooth LE / Zigbee', text: 'Corto alcance y muy bajo consumo' },
      { name: 'LoRaWAN', text: 'Kilómetros de alcance, años de batería' },
      { name: 'Celular (LTE-M, NB-IoT)', text: 'Donde no hay otra red' },
    ],
  },
  {
    icon: Network,
    title: 'Llevan los datos a las aplicaciones',
    items: [
      { name: 'MQTT', text: 'Mensajes en tiempo real entre muchos dispositivos' },
      { name: 'HTTP / REST', text: 'Envíos ocasionales y consultas desde una app' },
      { name: 'CoAP', text: 'Parecido a HTTP, para dispositivos muy limitados' },
    ],
  },
  {
    icon: Factory,
    title: 'Hablan con máquinas en planta',
    items: [
      { name: 'Modbus', text: 'PLCs, variadores y medidores' },
      { name: 'OPC UA', text: 'Intercambio de datos entre sistemas industriales' },
    ],
  },
]

const COMBINED_EXAMPLE = [
  { name: 'Sensor del invernadero', via: 'Zigbee' },
  { name: 'Gateway', via: 'MQTT' },
  { name: 'Servidor', via: 'HTTP' },
  { name: 'App del celular' },
]

function IconCard({ icon: Icon, title, text }) {
  return (
    <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/70">
      <Icon className="w-5 h-5 text-cyan-400" />
      <span className="block text-sm font-semibold text-slate-100 mt-2">{title}</span>
      <span className="block text-xs text-slate-400 mt-1 leading-snug">{text}</span>
    </div>
  )
}

export function IotIntroStep() {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-7">
      <p className="text-sm text-slate-300 leading-relaxed">
        El <span className="font-semibold text-emerald-300">Internet de las Cosas (IoT)</span> conecta objetos
        físicos a internet para medir, enviar datos y actuar sin que alguien esté presente.
        Un termómetro deja de ser una pantalla en la pared y se convierte en un dato que puedes ver desde cualquier lugar.
      </p>

      <Section icon={Layers} title="El recorrido de un dato">
        <div className="flex flex-col sm:flex-row sm:items-stretch gap-2">
          {FLOW.map((item, i) => (
            <React.Fragment key={item.title}>
              <div className="flex-1 p-3 rounded-xl border border-slate-800 bg-slate-900/70 text-center">
                <item.icon className="w-6 h-6 mx-auto text-cyan-400" />
                <span className="block text-xs font-semibold text-slate-100 mt-2">{item.title}</span>
                <span className="block text-[11px] text-slate-400 mt-1 leading-snug">{item.text}</span>
              </div>
              {i < FLOW.length - 1 && (
                <ArrowRight className="w-4 h-4 text-slate-600 self-center shrink-0 rotate-90 sm:rotate-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </Section>

      <Section icon={Cpu} title="¿Cómo se conecta un objeto físico a internet?">
        <p className="text-sm text-slate-300 leading-relaxed">
          Gracias a un <span className="font-semibold text-emerald-300">dispositivo embebido</span>: una pequeña
          computadora dedicada a una sola tarea que va dentro del objeto, como el sensor de un invernadero o una
          estación de clima. Es el puente entre el mundo físico y la red:
        </p>
        <div className="grid sm:grid-cols-3 gap-2.5">
          {EMBEDDED_ROLES.map((item) => <IconCard key={item.title} {...item} />)}
        </div>
        <p className="text-xs text-slate-400">
          Suelen tener poca memoria y a veces funcionan con batería, por eso usan protocolos de comunicación ligeros.
        </p>
      </Section>

      <Section icon={Network} title="Protocolos que forman el ecosistema">
        <p className="text-sm text-slate-300 leading-relaxed">
          Un sistema IoT combina varios protocolos, cada uno resuelve una parte del camino:
        </p>
        <div className="grid md:grid-cols-3 gap-2.5">
          {PROTOCOL_GROUPS.map((group) => (
            <div key={group.title} className="p-3 rounded-xl border border-slate-800 bg-slate-900/70 space-y-2.5">
              <div className="flex items-center gap-2">
                <group.icon className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-100">{group.title}</span>
              </div>
              <ul className="space-y-2">
                {group.items.map((item) => (
                  <li key={item.name}>
                    <span className="block text-sm font-semibold text-slate-200">{item.name}</span>
                    <span className="block text-[11px] text-slate-500 leading-snug">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-2.5">
          <p className="text-sm text-slate-200">
            <span className="font-semibold text-emerald-300">No son excluyentes, se complementan.</span>{' '}
            Por ejemplo:
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2">
            {COMBINED_EXAMPLE.map((step) => (
              <React.Fragment key={step.name}>
                <span className="px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-950/60 text-xs text-slate-200 text-center">
                  {step.name}
                </span>
                {step.via && (
                  <span className="flex items-center justify-center gap-1 text-[11px] font-mono text-cyan-300 shrink-0">
                    {step.via}
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 rotate-90 sm:rotate-0" />
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </Section>
    </div>
  )
}
