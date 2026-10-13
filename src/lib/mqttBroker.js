export const SECURE_BROKER_URL = 'wss://curso-iot-broker-100-48-65-94.sslip.io'
export const INSECURE_BROKER_URL = 'ws://100.48.65.94:9001'

// Una página servida por HTTPS no puede abrir ws:// (mixed content): se fuerza wss://.
export function resolveBrokerUrl(url) {
  if (url && typeof window !== 'undefined' && window.location.protocol === 'https:' && url.startsWith('ws://')) {
    return SECURE_BROKER_URL
  }
  return url
}

// Devuelve un mensaje de error o null si el filtro de tópico es válido según MQTT 3.1.1.
export function validateTopicFilter(filter) {
  if (!filter) return 'Escribe un tópico.'
  const levels = filter.split('/')
  for (let i = 0; i < levels.length; i++) {
    const level = levels[i]
    if (level.includes('#') && (level !== '#' || i !== levels.length - 1)) {
      return '"#" debe ocupar el último nivel completo (ej. devices/#).'
    }
    if (level.includes('+') && level !== '+') {
      return '"+" debe ocupar un nivel completo (ej. devices/+/telemetria).'
    }
  }
  return null
}

// Al publicar el tópico es un nombre concreto: los comodines solo valen para suscribirse.
export function validateTopicName(topic) {
  if (!topic) return 'Escribe un tópico.'
  if (topic.includes('+') || topic.includes('#')) {
    return 'Los comodines + y # solo sirven para suscribirse; al publicar usa un tópico concreto.'
  }
  return null
}
