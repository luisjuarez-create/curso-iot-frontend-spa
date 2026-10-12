// Catálogo de tipos de variable y sus unidades. La unidad solo se muestra:
// no se convierten valores, debe coincidir con lo que publica el dispositivo.
export const VARIABLE_TYPES = [
  { id: 'generic', label: 'Genérico / Otro', units: [] },
  {
    id: 'temperature',
    label: 'Temperatura',
    units: [
      { id: '°C', label: 'Grados Celsius (°C)' },
      { id: '°F', label: 'Grados Fahrenheit (°F)' },
      { id: 'K', label: 'Kelvin (K)' },
    ],
  },
  {
    id: 'humidity',
    label: 'Humedad',
    units: [
      { id: '% HR', label: 'Humedad relativa (% HR)' },
      { id: 'g/m³', label: 'Humedad absoluta (g/m³)' },
    ],
  },
  {
    id: 'pressure',
    label: 'Presión',
    units: [
      { id: 'hPa', label: 'Hectopascales (hPa)' },
      { id: 'kPa', label: 'Kilopascales (kPa)' },
      { id: 'Pa', label: 'Pascales (Pa)' },
      { id: 'bar', label: 'Bar (bar)' },
      { id: 'psi', label: 'Libras por pulgada² (psi)' },
      { id: 'mmHg', label: 'Milímetros de mercurio (mmHg)' },
    ],
  },
  {
    id: 'voltage',
    label: 'Voltaje',
    units: [
      { id: 'V', label: 'Volts (V)' },
      { id: 'mV', label: 'Milivolts (mV)' },
    ],
  },
  {
    id: 'current',
    label: 'Corriente',
    units: [
      { id: 'A', label: 'Amperes (A)' },
      { id: 'mA', label: 'Miliamperes (mA)' },
    ],
  },
  {
    id: 'power',
    label: 'Potencia',
    units: [
      { id: 'W', label: 'Watts (W)' },
      { id: 'kW', label: 'Kilowatts (kW)' },
    ],
  },
  {
    id: 'distance',
    label: 'Distancia / Nivel',
    units: [
      { id: 'mm', label: 'Milímetros (mm)' },
      { id: 'cm', label: 'Centímetros (cm)' },
      { id: 'm', label: 'Metros (m)' },
    ],
  },
  {
    id: 'light',
    label: 'Iluminación',
    units: [{ id: 'lx', label: 'Lux (lx)' }],
  },
  {
    id: 'percent',
    label: 'Porcentaje',
    units: [{ id: '%', label: 'Porcentaje (%)' }],
  },
]

export const DEFAULT_COLORS = {
  minColor: '#06b6d4',
  normalColor: '#10b981',
  maxColor: '#ef4444',
}

export function getVariableType(id) {
  return VARIABLE_TYPES.find((t) => t.id === id) || VARIABLE_TYPES[0]
}

export function isSet(v) {
  return v !== null && v !== undefined && v !== '' && !Number.isNaN(Number(v))
}

// Gauge y barra de nivel necesitan saber qué rango representan.
export function requiresScale(widgetType) {
  return widgetType === 'gauge' || widgetType === 'level_bar'
}

export const DEFAULT_SCALE = { min: 0, max: 100 }

export function getScale(settings = {}) {
  return {
    min: isSet(settings.scaleMin) ? Number(settings.scaleMin) : DEFAULT_SCALE.min,
    max: isSet(settings.scaleMax) ? Number(settings.scaleMax) : DEFAULT_SCALE.max,
  }
}

export function supportsScale(widgetType) {
  return requiresScale(widgetType) || widgetType === 'line_chart' || widgetType === 'bar_chart'
}

export function getColors(settings = {}) {
  return {
    minColor: settings.minColor || DEFAULT_COLORS.minColor,
    normalColor: settings.normalColor || DEFAULT_COLORS.normalColor,
    maxColor: settings.maxColor || DEFAULT_COLORS.maxColor,
  }
}

// Zona según los umbrales de alerta (settings.min / settings.max).
// Devuelve null si no hay umbrales configurados o el valor no es numérico.
export function getZone(value, settings = {}) {
  const num = Number(value)
  if (Number.isNaN(num)) return null
  const hasLow = isSet(settings.min)
  const hasHigh = isSet(settings.max)
  if (!hasLow && !hasHigh) return null
  if (hasLow && num < Number(settings.min)) return 'low'
  if (hasHigh && num > Number(settings.max)) return 'high'
  return 'normal'
}

export function zoneColor(zone, colors) {
  if (zone === 'low') return colors.minColor
  if (zone === 'high') return colors.maxColor
  return colors.normalColor
}

export function formatNumber(v, decimals = 1) {
  const num = Number(v)
  if (Number.isNaN(num)) return String(v)
  return Number.isInteger(num) ? String(num) : num.toFixed(decimals)
}
