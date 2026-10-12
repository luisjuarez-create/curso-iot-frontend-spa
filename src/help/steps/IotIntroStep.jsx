import React from 'react'
import {
  Thermometer, Cpu, Wifi, Radio, Monitor, ArrowRight,
  Battery, MemoryStick, Zap, Send, Layers,
} from 'lucide-react'
import { Section } from '../Section.jsx'

const FLOW = [
  { icon: Thermometer, title: 'Sensor', text: 'Mide temperatura, humedad, luz…' },
  { icon: Cpu, title: 'Microcontrolador', text: 'ESP32: lee el sensor y arma el mensaje' },
  { icon: Wifi, title: 'Red', text: 'WiFi lleva el dato a internet' },
  { icon: Radio, title: 'Broker MQTT', text: 'Recibe y reparte los mensajes' },
  { icon: Monitor, title: 'Aplicación', text: 'Dashboard, alertas, base de datos' },
]

const EMBEDDED_LIMITS = [
  { icon: MemoryStick, title: 'Poca memoria', text: 'Unos cientos de KB, no GB como una computadora.' },
  { icon: Battery, title: 'Bajo consumo', text: 'Muchos funcionan con batería durante meses.' },
  { icon: Wifi, title: 'Red inestable', text: 'La señal se cae y el dispositivo debe reconectarse solo.' },
]

const MQTT_ADVANTAGES = [
  { icon: Zap, title: 'Ligero', text: 'Mensajes con muy poca información extra; ideal para microcontroladores.' },
  { icon: Send, title: 'Publicar y suscribirse', text: 'El sensor no necesita saber quién lee sus datos; el broker los reparte.' },
  { icon: Layers, title: 'Escala fácil', text: 'Agregar un dispositivo o una pantalla nueva no cambia a los demás.' },
]

const PROTOCOLS = [
  { name: 'MQTT', context: 'Telemetría en tiempo real con muchos dispositivos', example: 'Monitoreo de sensores, domótica', highlight: true },
  { name: 'HTTP / REST', context: 'Envíos ocasionales o consultar datos desde una app', example: 'APIs web, subir una lectura al día' },
  { name: 'CoAP', context: 'Dispositivos muy limitados, parecido a HTTP pero más ligero', example: 'Redes de sensores de bajo consumo' },
  { name: 'LoRaWAN', context: 'Kilómetros de alcance y años de batería, pocos datos', example: 'Agricultura, medidores de agua' },
  { name: 'Modbus / OPC UA', context: 'Máquinas y PLCs en planta', example: 'Industria y automatización' },
  { name: 'BLE / Zigbee', context: 'Corto alcance y muy bajo consumo', example: 'Wearables, focos y sensores del hogar' },
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

      <Section icon={Radio} title="El recorrido de un dato">
        <div className="flex flex-col sm:flex-row sm:items-stretch gap-2">
          {FLOW.map((item, i) => (
            <React.Fragment key={item.title}>
              <div className="flex-1 p-3 rounded-xl border border-slate-800 bg-slate-900/70 text-center">
                <item.icon className={`w-6 h-6 mx-auto ${item.title === 'Broker MQTT' ? 'text-emerald-400' : 'text-cyan-400'}`} />
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

      <Section icon={Cpu} title="Dispositivos embebidos">
        <p className="text-sm text-slate-300 leading-relaxed">
          Un dispositivo embebido es una pequeña computadora dedicada a una sola tarea, como el ESP32.
          Su ventaja es que es barato y pequeño, pero trabaja con límites:
        </p>
        <div className="grid sm:grid-cols-3 gap-2.5">
          {EMBEDDED_LIMITS.map((item) => <IconCard key={item.title} {...item} />)}
        </div>
      </Section>

      <Section icon={Send} title="¿Por qué MQTT y un broker?">
        <p className="text-sm text-slate-300 leading-relaxed">
          MQTT es un protocolo pensado justo para esos límites. Los dispositivos no se hablan entre sí:
          todos se conectan a un servidor central, el <span className="font-semibold text-emerald-300">broker</span>,
          que recibe cada mensaje y lo entrega a quien esté suscrito a ese tópico.
        </p>
        <div className="grid sm:grid-cols-3 gap-2.5">
          {MQTT_ADVANTAGES.map((item) => <IconCard key={item.title} {...item} />)}
        </div>
      </Section>

      <Section icon={Layers} title="Otros protocolos y cuándo se usan">
        <div className="rounded-xl border border-slate-800 overflow-hidden divide-y divide-slate-800">
          {PROTOCOLS.map((p) => (
            <div
              key={p.name}
              className={`grid grid-cols-[110px_1fr] sm:grid-cols-[150px_1fr] gap-3 px-3.5 py-2.5 ${
                p.highlight ? 'bg-emerald-500/10' : 'bg-slate-900/50'
              }`}
            >
              <span className={`text-sm font-bold ${p.highlight ? 'text-emerald-300' : 'text-slate-200'}`}>{p.name}</span>
              <div className="min-w-0">
                <span className="block text-xs text-slate-300">{p.context}</span>
                <span className="block text-[11px] text-slate-500">{p.example}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400">
          No compiten entre sí: un mismo sistema puede usar BLE o LoRaWAN cerca del sensor y MQTT para llevar los datos a la nube.
        </p>
      </Section>
    </div>
  )
}
