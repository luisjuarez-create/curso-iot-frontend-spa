import { useState, useEffect } from 'react'

// Rutas por hash para no depender del servidor web:
//   #/                         -> dashboard
//   #/ayuda                    -> primer paso de la primera guía
//   #/ayuda/<guia>/<paso>      -> paso concreto
export function parseHash(hash) {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean)
  if (parts[0] !== 'ayuda') return { view: 'dashboard' }
  return { view: 'help', guideId: parts[1] || null, stepId: parts[2] || null }
}

export function useHashRoute() {
  const [route, setRoute] = useState(() => parseHash(window.location.hash))

  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash))
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return route
}

export function helpHash(guideId, stepId) {
  if (!guideId) return '#/ayuda'
  return stepId ? `#/ayuda/${guideId}/${stepId}` : `#/ayuda/${guideId}`
}

export function navigate(hash) {
  window.location.hash = hash
}
