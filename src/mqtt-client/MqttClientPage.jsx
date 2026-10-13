import React, { useMemo, useState } from 'react'
import {
  Terminal,
  Lock,
  ChevronDown,
  Plus,
  X,
  Pause,
  Play,
  Trash2,
  Braces,
  FileText,
  ListTree,
  MessageSquare,
  AlertTriangle,
  Filter,
  Send,
  Check,
  WandSparkles,
} from 'lucide-react'
import { PageHeader, PageTitle } from '../components/PageHeader.jsx'
import { useMqttExplorer, KEEPALIVE_SECONDS } from '../hooks/useMqttExplorer.js'
import { validateTopicFilter, validateTopicName } from '../lib/mqttBroker.js'

const PUBLISH_TEMPLATES = [
  { label: 'LED on', payload: '{"led": true}' },
  { label: 'LED off', payload: '{"led": false}' },
  { label: 'Color', payload: '{"color": "#ff0080"}' },
]

function parseJson(text) {
  try {
    return { ok: true, value: JSON.parse(text) }
  } catch {
    return { ok: false }
  }
}

const STATUS_STYLES = {
  connected: { label: 'Conectado', className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', dot: 'bg-emerald-400 animate-pulse' },
  connecting: { label: 'Conectando…', className: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30', dot: 'bg-cyan-400 animate-ping' },
  error: { label: 'Error', className: 'bg-rose-500/10 text-rose-400 border-rose-500/30', dot: 'bg-rose-400' },
  disconnected: { label: 'Desconectado', className: 'bg-slate-800 text-slate-400 border-slate-700', dot: 'bg-rose-500' },
}

function formatTime(date) {
  return `${date.toLocaleTimeString('es-MX', { hour12: false })}.${String(date.getMilliseconds()).padStart(3, '0')}`
}

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.disconnected
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-mono font-medium px-2 py-0.5 rounded-lg border ${s.className}`}>
      <span className={`w-2 h-2 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  )
}

function ReadOnlyField({ label, value }) {
  return (
    <div>
      <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">{label}</span>
      <div className="mt-0.5 flex items-center gap-2 bg-slate-950/70 border border-slate-800 rounded-lg px-2.5 py-1.5" title={value}>
        <Lock className="w-3 h-3 text-slate-600 shrink-0" />
        <span className="text-xs font-mono text-slate-300 truncate select-all">{value}</span>
      </div>
    </div>
  )
}

function ConnectionPanel({ url, clientId, status }) {
  const [open, setOpen] = useState(false)
  const transport = url?.startsWith('wss://') ? 'WebSocket seguro (WSS / TLS)' : 'WebSocket (WS, sin cifrar)'

  return (
    <section className="p-3 border-b border-slate-800">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-2"
      >
        <span className="text-xs font-bold text-slate-100">Conexión</span>
        <span className="flex items-center gap-2">
          <StatusBadge status={status} />
          <ChevronDown className={`w-4 h-4 text-slate-500 transition ${open ? 'rotate-180' : ''}`} />
        </span>
      </button>

      <div className={`${open ? 'grid' : 'hidden'} gap-2 mt-3`}>
        <ReadOnlyField label="Broker" value={url || '—'} />
        <ReadOnlyField label="Transporte" value={transport} />
        <div className="grid grid-cols-2 gap-2">
          <ReadOnlyField label="Protocolo" value="MQTT 3.1.1" />
          <ReadOnlyField label="Keep alive" value={`${KEEPALIVE_SECONDS} s`} />
          <ReadOnlyField label="Clean session" value="Sí" />
          <ReadOnlyField label="Autenticación" value="Anónima" />
        </div>
        <ReadOnlyField label="Client ID" value={clientId} />
        <p className="text-[10px] text-slate-500 leading-snug">
          Parámetros fijos del curso. El broker se cambia desde el selector de tópico del dashboard.
        </p>
      </div>
    </section>
  )
}

function SubscribePanel({ status, subscriptions, onSubscribe, onUnsubscribe }) {
  const [topic, setTopic] = useState('devices/#')
  const trimmed = topic.trim()
  const error = trimmed ? validateTopicFilter(trimmed) : null
  const leadingSlash = trimmed.startsWith('/')
  const alreadySubscribed = subscriptions.some((s) => s.topic === trimmed)
  const canSubscribe = status === 'connected' && trimmed && !error && !alreadySubscribed

  const submit = (e) => {
    e.preventDefault()
    if (canSubscribe) onSubscribe(trimmed)
  }

  return (
    <section className="p-3 border-b border-slate-800 space-y-2">
      <span className="text-xs font-bold text-slate-100">Suscripciones</span>
      <form onSubmit={submit} className="flex gap-2">
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="devices/#"
          spellCheck={false}
          className="flex-1 min-w-0 bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/70 transition"
        />
        <button
          type="submit"
          disabled={!canSubscribe}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-bold disabled:opacity-40 disabled:pointer-events-none transition active:scale-95"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          Suscribir
        </button>
      </form>

      {error && <p className="text-[11px] text-rose-400">{error}</p>}
      {!error && leadingSlash && (
        <p className="text-[11px] text-amber-400 flex gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-px" />
          <span>
            Un "/" al inicio crea un primer nivel vacío: <code className="font-mono">/devices/#</code> no coincide con{' '}
            <code className="font-mono">devices/#</code>.
          </span>
        </p>
      )}
      {!error && !leadingSlash && (
        <p className="text-[10px] text-slate-500 leading-snug">
          Comodines: <code className="font-mono text-slate-400">+</code> un nivel,{' '}
          <code className="font-mono text-slate-400">#</code> todos los niveles restantes.
        </p>
      )}

      {subscriptions.length > 0 && (
        <ul className="flex flex-wrap gap-1.5 pt-1">
          {subscriptions.map((s) => (
            <li
              key={s.topic}
              className={`flex items-center gap-1.5 pl-2 pr-1 py-0.5 rounded-lg border text-[11px] font-mono ${
                s.state === 'error'
                  ? 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                  : s.state === 'pending'
                  ? 'bg-slate-800 border-slate-700 text-slate-400'
                  : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
              }`}
              title={s.state === 'error' ? 'El broker rechazó la suscripción' : s.topic}
            >
              <span className="truncate max-w-[220px]">{s.topic}</span>
              <button onClick={() => onUnsubscribe(s.topic)} className="p-0.5 rounded hover:bg-slate-950/60" title="Cancelar suscripción">
                <X className="w-3 h-3" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function PublishPanel({ status, onPublish }) {
  const [open, setOpen] = useState(false)
  const [topic, setTopic] = useState('devices/unoq-0fb74d07/cmd')
  const [payload, setPayload] = useState('{"led": true}')
  const [qos, setQos] = useState(0)
  const [retain, setRetain] = useState(false)
  const [result, setResult] = useState(null) // { ok, text }

  const trimmedTopic = topic.trim()
  const topicError = trimmedTopic ? validateTopicName(trimmedTopic) : null
  const json = payload.trim() ? parseJson(payload) : null
  const canPublish = status === 'connected' && trimmedTopic && !topicError

  const submit = async (e) => {
    e.preventDefault()
    if (!canPublish) return
    try {
      await onPublish(trimmedTopic, payload, { qos, retain })
      setResult({ ok: true, text: `Publicado ${formatTime(new Date())}` })
    } catch (err) {
      setResult({ ok: false, text: err?.message || 'No se pudo publicar' })
    }
  }

  const edit = (setter) => (value) => {
    setter(value)
    setResult(null)
  }

  return (
    <section className="p-3 border-b border-slate-800">
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between gap-2">
        <span className="text-xs font-bold text-slate-100">Publicar</span>
        <ChevronDown className={`w-4 h-4 text-slate-500 transition ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <form onSubmit={submit} className="mt-2.5 space-y-2">
          <input
            value={topic}
            onChange={(e) => edit(setTopic)(e.target.value)}
            placeholder="devices/mi-dispositivo/cmd"
            spellCheck={false}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/70 transition"
          />
          {topicError && <p className="text-[11px] text-rose-400">{topicError}</p>}

          <div className="flex flex-wrap gap-1">
            {PUBLISH_TEMPLATES.map((t) => (
              <button
                key={t.label}
                type="button"
                onClick={() => edit(setPayload)(t.payload)}
                className="px-2 py-0.5 rounded-md border border-slate-700 bg-slate-800/60 text-[10px] font-mono text-slate-300 hover:border-slate-500 hover:text-white transition"
              >
                {t.label}
              </button>
            ))}
          </div>

          <textarea
            value={payload}
            onChange={(e) => edit(setPayload)(e.target.value)}
            rows={4}
            spellCheck={false}
            placeholder='{"led": true}'
            className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/70 transition resize-y"
          />

          <div className="flex items-center justify-between gap-2 text-[10px]">
            {json === null ? (
              <span className="text-slate-500">Payload vacío</span>
            ) : json.ok ? (
              <span className="text-emerald-400">JSON válido</span>
            ) : (
              <span className="text-amber-400">No es JSON: se envía como texto</span>
            )}
            {json?.ok && (
              <button
                type="button"
                onClick={() => edit(setPayload)(JSON.stringify(json.value, null, 2))}
                className="flex items-center gap-1 text-slate-400 hover:text-emerald-300 transition"
              >
                <WandSparkles className="w-3 h-3" /> Formatear
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs">
            <label className="flex items-center gap-1.5 text-slate-400">
              QoS
              <select
                value={qos}
                onChange={(e) => edit(setQos)(Number(e.target.value))}
                className="bg-slate-950 border border-slate-700 rounded-md px-1.5 py-0.5 text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
              >
                <option value={0}>0</option>
                <option value={1}>1</option>
                <option value={2}>2</option>
              </select>
            </label>
            <label className="flex items-center gap-1.5 text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={retain}
                onChange={(e) => edit(setRetain)(e.target.checked)}
                className="accent-amber-500"
              />
              Retain
            </label>
            <button
              type="submit"
              disabled={!canPublish}
              className="ml-auto flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-bold disabled:opacity-40 disabled:pointer-events-none transition active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              Publicar
            </button>
          </div>

          {retain && (
            <p className="text-[10px] text-amber-400 leading-snug">
              {payload === ''
                ? 'Payload vacío con retain: borra el mensaje retenido de este tópico.'
                : 'El broker guardará este mensaje y lo entregará a cada nuevo suscriptor del tópico.'}
            </p>
          )}
          {result && (
            <p className={`flex items-center gap-1 text-[11px] ${result.ok ? 'text-emerald-400' : 'text-rose-400'}`}>
              {result.ok ? <Check className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
              {result.text}
            </p>
          )}
        </form>
      )}
    </section>
  )
}

function TopicList({ topics, selectedTopic, onSelect }) {
  const list = useMemo(() => Object.values(topics).sort((a, b) => a.topic.localeCompare(b.topic)), [topics])

  if (list.length === 0) {
    return <p className="p-4 text-center text-xs text-slate-500">Aún no llegan mensajes. Suscríbete a un tópico.</p>
  }

  return (
    <ul className="p-2 space-y-1">
      {list.map((t) => {
        const active = t.topic === selectedTopic
        return (
          <li key={t.topic}>
            <button
              onClick={() => onSelect(active ? null : t.topic)}
              className={`w-full text-left px-2.5 py-2 rounded-lg border transition ${
                active
                  ? 'bg-emerald-500/10 border-emerald-500/40'
                  : 'border-transparent hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`text-xs font-mono truncate ${active ? 'text-emerald-300' : 'text-slate-200'}`}>{t.topic}</span>
                <span className="text-[10px] font-mono px-1.5 rounded-full bg-slate-800 text-slate-400 shrink-0">{t.count}</span>
              </div>
              <div className="text-[10px] font-mono text-slate-500 truncate mt-0.5">{t.last.text}</div>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

function MessageItem({ message, viewMode, onSelectTopic }) {
  const showJson = viewMode === 'json' && message.pretty
  return (
    <li className="rounded-xl border border-slate-800 bg-slate-900/60 p-2.5">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <button
          onClick={() => onSelectTopic(message.topic)}
          className="text-xs font-mono font-semibold text-emerald-300 hover:underline truncate max-w-full text-left"
          title="Filtrar por este tópico"
        >
          {message.topic}
        </button>
        <span className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
          <span>{formatTime(message.time)}</span>
          <span>{message.size} B</span>
          <span>QoS {message.qos}</span>
          {message.retain && <span className="px-1 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">RETAIN</span>}
          {viewMode === 'json' && !message.pretty && (
            <span className="px-1 rounded bg-slate-800 text-slate-400 border border-slate-700">no es JSON</span>
          )}
        </span>
      </div>
      <pre className={`mt-1.5 text-xs font-mono whitespace-pre-wrap break-all ${showJson ? 'text-cyan-200' : 'text-slate-300'}`}>
        {showJson ? message.pretty : message.text || <span className="italic text-slate-600">(payload vacío)</span>}
      </pre>
    </li>
  )
}

export function MqttClientPage({ brokerUrl, onExit }) {
  const mqttClient = useMqttExplorer(brokerUrl)
  const { messages, topics, paused, setPaused, clear } = mqttClient
  const [viewMode, setViewMode] = useState('json')
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [mobileTab, setMobileTab] = useState('messages')

  const visibleMessages = selectedTopic ? messages.filter((m) => m.topic === selectedTopic) : messages
  const topicCount = Object.keys(topics).length

  const selectTopic = (topic) => {
    setSelectedTopic(topic)
    setMobileTab('messages')
  }

  const topicList = <TopicList topics={topics} selectedTopic={selectedTopic} onSelect={selectTopic} />

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      <PageHeader icon={Terminal} title="Cliente MQTT" onExit={onExit} />

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Panel de conexión, suscripciones y tópicos */}
        <aside className="lg:w-[340px] shrink-0 border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-900/60 flex flex-col lg:overflow-y-auto">
          <PageTitle
            icon={Terminal}
            title="Cliente MQTT"
            subtitle="Explorador de mensajes en vivo"
            className="p-3 border-b border-slate-800"
          />
          <ConnectionPanel url={mqttClient.url} clientId={mqttClient.clientId} status={mqttClient.status} />
          <SubscribePanel
            status={mqttClient.status}
            subscriptions={mqttClient.subscriptions}
            onSubscribe={mqttClient.subscribe}
            onUnsubscribe={mqttClient.unsubscribe}
          />
          <PublishPanel status={mqttClient.status} onPublish={mqttClient.publish} />
          <div className="hidden lg:flex flex-col flex-1 min-h-[200px]">
            <div className="px-3 pt-3 pb-1 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-100">Tópicos recibidos</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">{topicCount}</span>
            </div>
            <div className="flex-1 overflow-y-auto">{topicList}</div>
          </div>
        </aside>

        {/* Mensajes */}
        <main className="flex-1 flex flex-col min-w-0 min-h-0">
          <div className="px-3 sm:px-4 py-2 border-b border-slate-800 flex flex-wrap items-center gap-2 shrink-0">
            {/* Pestañas (móvil) */}
            <div className="lg:hidden flex rounded-lg border border-slate-700 overflow-hidden text-xs font-semibold">
              <button
                onClick={() => setMobileTab('messages')}
                className={`flex items-center gap-1 px-2.5 py-1.5 ${mobileTab === 'messages' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}
              >
                <MessageSquare className="w-3.5 h-3.5" /> Mensajes
              </button>
              <button
                onClick={() => setMobileTab('topics')}
                className={`flex items-center gap-1 px-2.5 py-1.5 ${mobileTab === 'topics' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}
              >
                <ListTree className="w-3.5 h-3.5" /> Tópicos ({topicCount})
              </button>
            </div>

            <span className="hidden lg:inline text-xs font-bold text-slate-100">Mensajes</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {visibleMessages.length}
            </span>

            {selectedTopic && (
              <span className="flex items-center gap-1 pl-2 pr-1 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-[11px] font-mono min-w-0">
                <Filter className="w-3 h-3 shrink-0" />
                <span className="truncate max-w-[180px] sm:max-w-[320px]">{selectedTopic}</span>
                <button onClick={() => setSelectedTopic(null)} className="p-0.5 rounded hover:bg-slate-950/60" title="Quitar filtro">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <div className="ml-auto flex items-center gap-1.5">
              <div className="flex rounded-lg border border-slate-700 overflow-hidden text-xs font-semibold">
                <button
                  onClick={() => setViewMode('json')}
                  className={`flex items-center gap-1 px-2.5 py-1.5 ${viewMode === 'json' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  <Braces className="w-3.5 h-3.5" /> JSON
                </button>
                <button
                  onClick={() => setViewMode('raw')}
                  className={`flex items-center gap-1 px-2.5 py-1.5 ${viewMode === 'raw' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  <FileText className="w-3.5 h-3.5" /> Raw
                </button>
              </div>
              <button
                onClick={() => setPaused((p) => !p)}
                className={`p-1.5 rounded-lg border transition ${
                  paused ? 'bg-amber-500/15 border-amber-500/40 text-amber-400' : 'border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
                title={paused ? 'Reanudar' : 'Pausar (los mensajes nuevos se descartan)'}
              >
                {paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => {
                  clear()
                  setSelectedTopic(null)
                }}
                className="p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 transition"
                title="Limpiar mensajes y tópicos"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {mobileTab === 'topics' && <div className="lg:hidden">{topicList}</div>}
            <div className={mobileTab === 'topics' ? 'hidden lg:block' : ''}>
              {visibleMessages.length === 0 ? (
                <p className="p-6 text-center text-xs text-slate-500">
                  {paused ? 'Recepción en pausa.' : 'Sin mensajes todavía.'}
                </p>
              ) : (
                <ul className="p-3 sm:p-4 space-y-2">
                  {visibleMessages.map((m) => (
                    <MessageItem key={m.id} message={m} viewMode={viewMode} onSelectTopic={selectTopic} />
                  ))}
                </ul>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
