import { useState, useEffect, useRef, useCallback } from 'react'
import mqtt from 'mqtt'
import { resolveBrokerUrl } from '../lib/mqttBroker.js'

export const KEEPALIVE_SECONDS = 60
const MAX_MESSAGES = 500
const FLUSH_INTERVAL_MS = 250
const decoder = new TextDecoder()

function toMessage(id, topic, payload, packet) {
  const text = decoder.decode(payload)
  let pretty = null
  try {
    const parsed = JSON.parse(text)
    if (parsed !== null && typeof parsed === 'object') pretty = JSON.stringify(parsed, null, 2)
  } catch {
    // payload no JSON: se muestra solo en crudo
  }
  return { id, topic, text, pretty, size: payload.length, qos: packet.qos, retain: packet.retain, time: new Date() }
}

// Cliente MQTT genérico independiente del cliente del dashboard.
export function useMqttExplorer(brokerUrl) {
  const [clientId] = useState(() => `web-explorer-${Math.random().toString(16).slice(2, 10)}`)
  const [status, setStatus] = useState('disconnected')
  const [subscriptions, setSubscriptions] = useState([]) // { topic, state: 'pending' | 'active' | 'error' }
  const [messages, setMessages] = useState([]) // más reciente primero
  const [topics, setTopics] = useState({}) // topic -> { topic, count, last }
  const [paused, setPaused] = useState(false)

  const clientRef = useRef(null)
  const bufferRef = useRef([])
  const pausedRef = useRef(false)
  const seqRef = useRef(0)

  const url = resolveBrokerUrl(brokerUrl)

  useEffect(() => {
    pausedRef.current = paused
  }, [paused])

  useEffect(() => {
    if (!url) return undefined
    setStatus('connecting')
    setSubscriptions([])

    // resubscribe (default de mqtt.js) restaura las suscripciones tras una reconexión
    const client = mqtt.connect(url, {
      clientId,
      clean: true,
      keepalive: KEEPALIVE_SECONDS,
      connectTimeout: 5000,
      reconnectPeriod: 3000,
    })
    clientRef.current = client

    client.on('connect', () => setStatus('connected'))
    client.on('reconnect', () => setStatus('connecting'))
    client.on('close', () => setStatus('disconnected'))
    client.on('error', () => setStatus('error'))
    client.on('message', (topic, payload, packet) => {
      if (pausedRef.current) return
      seqRef.current += 1
      bufferRef.current.push(toMessage(seqRef.current, topic, payload, packet))
    })

    return () => {
      client.end(true)
      clientRef.current = null
    }
  }, [url, clientId])

  useEffect(() => {
    const id = setInterval(() => {
      const batch = bufferRef.current
      if (batch.length === 0) return
      bufferRef.current = []

      setTopics((prev) => {
        const next = { ...prev }
        for (const m of batch) {
          next[m.topic] = { topic: m.topic, count: (next[m.topic]?.count || 0) + 1, last: m }
        }
        return next
      })
      setMessages((prev) => [...batch.reverse(), ...prev].slice(0, MAX_MESSAGES))
    }, FLUSH_INTERVAL_MS)
    return () => clearInterval(id)
  }, [])

  const subscribe = useCallback((topic) => {
    const client = clientRef.current
    if (!client?.connected) return
    setSubscriptions((prev) => [...prev.filter((s) => s.topic !== topic), { topic, state: 'pending' }])
    client.subscribe(topic, { qos: 0 }, (err, granted) => {
      // QoS 128 en el SUBACK = el broker rechazó la suscripción
      const failed = Boolean(err) || granted?.some((g) => g.qos === 128)
      setSubscriptions((prev) =>
        prev.map((s) => (s.topic === topic ? { ...s, state: failed ? 'error' : 'active' } : s))
      )
    })
  }, [])

  const unsubscribe = useCallback((topic) => {
    clientRef.current?.unsubscribe(topic)
    setSubscriptions((prev) => prev.filter((s) => s.topic !== topic))
  }, [])

  const publish = useCallback(
    (topic, payload, { qos = 0, retain = false } = {}) =>
      new Promise((resolve, reject) => {
        const client = clientRef.current
        if (!client?.connected) {
          reject(new Error('Sin conexión al broker'))
          return
        }
        client.publish(topic, payload, { qos, retain }, (err) => (err ? reject(err) : resolve()))
      }),
    []
  )

  const clear = useCallback(() => {
    bufferRef.current = []
    setMessages([])
    setTopics({})
  }, [])

  return {
    url,
    clientId,
    status,
    subscriptions,
    messages,
    topics,
    paused,
    setPaused,
    subscribe,
    unsubscribe,
    publish,
    clear,
  }
}
