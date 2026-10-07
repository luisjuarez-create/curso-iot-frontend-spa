import { useState, useEffect, useRef } from 'react'
import mqtt from 'mqtt'

export function useMqtt(brokerUrl, deviceId) {
  const [status, setStatus] = useState('disconnected') // 'disconnected' | 'connecting' | 'connected' | 'error'
  const [variables, setVariables] = useState({})
  const [packetCount, setPacketCount] = useState(0)
  const [lastPacketTime, setLastPacketTime] = useState(null)
  const clientRef = useRef(null)

  // Reset variables when deviceId changes
  useEffect(() => {
    setVariables({})
    setPacketCount(0)
    setLastPacketTime(null)
  }, [deviceId])

  useEffect(() => {
    if (!brokerUrl || !deviceId) {
      setStatus('disconnected')
      return
    }

    setStatus('connecting')

    const clientId = `web-dash-${Math.random().toString(16).substring(2, 10)}`
    console.log(`[MQTT] Conectando a ${brokerUrl} con ID ${clientId}...`)

    const client = mqtt.connect(brokerUrl, {
      clientId,
      clean: true,
      connectTimeout: 5000,
      reconnectPeriod: 3000,
    })

    clientRef.current = client

    client.on('connect', () => {
      console.log(`[MQTT] Conectado exitosamente a ${brokerUrl}`)
      setStatus('connected')
      
      const topic = `devices/${deviceId}/#`
      client.subscribe(topic, (err) => {
        if (err) {
          console.error(`[MQTT] Error suscribiendo a ${topic}:`, err)
        } else {
          console.log(`[MQTT] Suscrito exitosamente a ${topic}`)
        }
      })
    })

    client.on('error', (err) => {
      console.error('[MQTT] Error de conexion:', err)
      setStatus('error')
    })

    client.on('close', () => {
      setStatus('disconnected')
    })

    client.on('reconnect', () => {
      setStatus('connecting')
    })

    client.on('message', (topic, message) => {
      try {
        const payloadStr = message.toString()
        const data = JSON.parse(payloadStr)
        const now = new Date()

        setPacketCount((prev) => prev + 1)
        setLastPacketTime(now)

        setVariables((prevVars) => {
          const updated = { ...prevVars }

          // Extraer cada par clave-valor numerico o booleano o texto
          Object.entries(data).forEach(([key, val]) => {
            // Ignorar metadatos obvios si no son metricas
            if (key === 'device_id') return

            const numVal = typeof val === 'number' ? val : Number(val)
            const isNumeric = !isNaN(numVal) && typeof val !== 'boolean'

            const current = updated[key] || {
              name: key,
              value: val,
              numericValue: isNumeric ? numVal : null,
              min: isNumeric ? numVal : null,
              max: isNumeric ? numVal : null,
              history: [],
              lastUpdated: now,
              unit: inferUnit(key),
            }

            const newNum = isNumeric ? numVal : current.numericValue
            const newMin = isNumeric
              ? current.min !== null
                ? Math.min(current.min, numVal)
                : numVal
              : null
            const newMax = isNumeric
              ? current.max !== null
                ? Math.max(current.max, numVal)
                : numVal
              : null

            const history = isNumeric
              ? [...(current.history || []).slice(-20), { time: now.toLocaleTimeString(), val: numVal }]
              : []

            updated[key] = {
              name: key,
              value: val,
              numericValue: newNum,
              min: newMin,
              max: newMax,
              history,
              lastUpdated: now,
              unit: inferUnit(key),
            }
          })

          return updated
        })
      } catch (err) {
        console.warn(`[MQTT] Mensaje en ${topic} no es JSON valido:`, err)
      }
    })

    return () => {
      if (client) {
        console.log('[MQTT] Desconectando cliente...')
        client.end(true)
      }
    }
  }, [brokerUrl, deviceId])

  return {
    status,
    variables,
    packetCount,
    lastPacketTime,
  }
}

// Infiere automaticamente la unidad segun el nombre de la variable
function inferUnit(varName) {
  const lower = varName.toLowerCase()
  if (lower.includes('temp')) return '°C'
  if (lower.includes('hum')) return '%'
  if (lower.includes('pres')) return 'hPa'
  if (lower.includes('bat') || lower.includes('volt')) return 'V'
  if (lower.includes('corriente') || lower.includes('amp')) return 'A'
  if (lower.includes('pot') || lower.includes('watt')) return 'W'
  if (lower.includes('rpm') || lower.includes('vel')) return 'RPM'
  if (lower.includes('lux') || lower.includes('luz')) return 'lx'
  if (lower.includes('dist') || lower.includes('nivel')) return 'cm'
  return ''
}
