import React, { useRef, useState, useEffect, useId } from 'react'

export function LineChartWidget({ variable, settings = {} }) {
  if (!variable) return null

  const containerRef = useRef(null)
  const [width, setWidth] = useState(320)
  const gradientId = useId()

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.floor(entry.contentRect.width)
        if (w > 50) setWidth(w)
      }
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const history = variable.history || []
  const values = history.map((h) => h.val)
  const currentVal = typeof variable.value === 'number' ? variable.value : Number(variable.value)

  let min = settings.min !== null && settings.min !== undefined ? settings.min : (values.length > 0 ? Math.min(...values) : 0)
  let max = settings.max !== null && settings.max !== undefined ? settings.max : (values.length > 0 ? Math.max(...values) : 100)
  if (min === max) {
    min = min - 1
    max = max + 1
  }
  const range = max - min === 0 ? 1 : max - min

  const minColor = settings.minColor || '#06b6d4'
  const normalColor = settings.normalColor || '#10b981'
  const maxColor = settings.maxColor || '#ef4444'

  // Determine line color based on current value
  let activeColor = normalColor
  if (settings.min !== null && currentVal < settings.min) activeColor = minColor
  else if (settings.max !== null && currentVal > settings.max) activeColor = maxColor

  const height = 110
  const paddingX = 14
  const paddingY = 14

  // Generate SVG path points
  const points = values.map((val, idx) => {
    const x = paddingX + (idx / Math.max(values.length - 1, 1)) * (width - 2 * paddingX)
    const clampedVal = Math.max(min, Math.min(max, val))
    const y = height - paddingY - ((clampedVal - min) / range) * (height - 2 * paddingY)
    return { x: Number(x.toFixed(1)), y: Number(y.toFixed(1)) }
  })

  // Smooth cubic bezier curve calculation
  let pathD = ''
  if (points.length === 1) {
    pathD = `M ${points[0].x},${points[0].y}`
  } else if (points.length > 1) {
    pathD = `M ${points[0].x},${points[0].y}`
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i]
      const p1 = points[i + 1]
      const mx = (p0.x + p1.x) / 2
      pathD += ` C ${mx},${p0.y} ${mx},${p1.y} ${p1.x},${p1.y}`
    }
  }

  const areaD =
    points.length > 1
      ? `${pathD} L ${points[points.length - 1].x},${height - paddingY} L ${points[0].x},${height - paddingY} Z`
      : ''

  const lastPoint = points.length > 0 ? points[points.length - 1] : { x: width - paddingX, y: height / 2 }

  return (
    <div className="flex flex-col justify-between h-full pt-1">
      {/* Header Stat */}
      <div className="flex items-baseline justify-between mb-2">
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-extrabold font-mono tracking-tight" style={{ color: activeColor }}>
            {isNaN(currentVal) ? String(variable.value) : currentVal.toFixed(2)}
          </span>
          <span className="text-xs font-bold text-slate-400 font-mono">{variable.unit}</span>
        </div>
        <div className="text-[10px] font-mono text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
          {history.length} muestras
        </div>
      </div>

      {/* SVG Line Chart Container with dynamic width measurement */}
      <div
        ref={containerRef}
        className="relative w-full h-28 my-auto overflow-hidden rounded-xl bg-slate-950/60 border border-slate-800/80 p-1"
      >
        {history.length < 2 ? (
          <div className="h-full flex items-center justify-center text-[11px] text-slate-500 font-mono">
            Esperando más lecturas...
          </div>
        ) : (
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full block">
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={activeColor} stopOpacity="0.4" />
                <stop offset="100%" stopColor={activeColor} stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Guide Lines */}
            <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="#1e293b" strokeDasharray="3 3" />
            <line x1={paddingX} y1={height / 2} x2={width - paddingX} y2={height / 2} stroke="#1e293b" strokeDasharray="3 3" />
            <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="#1e293b" strokeDasharray="3 3" />

            {/* Area Fill */}
            {areaD && <path d={areaD} fill={`url(#${gradientId})`} />}

            {/* Smooth Line Path */}
            {pathD && (
              <path
                d={pathD}
                fill="none"
                stroke={activeColor}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Pulse indicator on latest point */}
            {points.length > 0 && (
              <g>
                <circle cx={lastPoint.x} cy={lastPoint.y} r="5" fill={activeColor} className="animate-ping opacity-60" />
                <circle cx={lastPoint.x} cy={lastPoint.y} r="4" fill={activeColor} stroke="#ffffff" strokeWidth="1.5" />
              </g>
            )}
          </svg>
        )}
      </div>

      {/* Range Labels */}
      <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mt-1">
        <span style={{ color: minColor }}>Mín: {min.toFixed(1)}</span>
        <span className="font-semibold" style={{ color: activeColor }}>● En vivo</span>
        <span style={{ color: maxColor }}>Máx: {max.toFixed(1)}</span>
      </div>
    </div>
  )
}

