import React from 'react'

export function LineChartWidget({ variable }) {
  if (!variable) return null

  const history = variable.history || []
  const values = history.map((h) => h.val)
  const currentVal = typeof variable.value === 'number' ? variable.value : Number(variable.value)

  // Calcule bounds with padding
  const minVal = values.length > 0 ? Math.min(...values) : 0
  const maxVal = values.length > 0 ? Math.max(...values) : 100
  const range = maxVal - minVal === 0 ? 1 : maxVal - minVal

  const width = 320
  const height = 120
  const paddingX = 10
  const paddingY = 15

  // Generate SVG path points
  const points = values.map((val, idx) => {
    const x = paddingX + (idx / Math.max(values.length - 1, 1)) * (width - 2 * paddingX)
    const y = height - paddingY - ((val - minVal) / range) * (height - 2 * paddingY)
    return `${x},${y}`
  })

  const pathD = points.length > 1 ? `M ${points.join(' L ')}` : ''
  const areaD =
    points.length > 1
      ? `M ${points[0]} L ${points.join(' L ')} L ${width - paddingX},${height - paddingY} L ${paddingX},${height - paddingY} Z`
      : ''

  const lastPoint = points.length > 0 ? points[points.length - 1].split(',') : [width - paddingX, height / 2]

  return (
    <div className="flex flex-col justify-between h-full pt-1">
      {/* Header Stat */}
      <div className="flex items-baseline justify-between mb-2">
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-extrabold font-mono text-slate-100">
            {isNaN(currentVal) ? String(variable.value) : currentVal.toFixed(2)}
          </span>
          <span className="text-xs font-bold text-cyan-400 font-mono">{variable.unit}</span>
        </div>
        <div className="text-[10px] font-mono text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
          {history.length} muestras
        </div>
      </div>

      {/* SVG Line Chart */}
      <div className="relative w-full h-28 my-auto overflow-hidden rounded-xl bg-slate-950/60 border border-slate-800/80 p-1">
        {history.length < 2 ? (
          <div className="h-full flex items-center justify-center text-[11px] text-slate-500 font-mono">
            Esperando más lecturas...
          </div>
        ) : (
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id={`grad-${variable.name}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Guide Lines */}
            <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="#1e293b" strokeDasharray="3 3" />
            <line x1={paddingX} y1={height / 2} x2={width - paddingX} y2={height / 2} stroke="#1e293b" strokeDasharray="3 3" />
            <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="#1e293b" strokeDasharray="3 3" />

            {/* Area Fill */}
            <path d={areaD} fill={`url(#grad-${variable.name})`} />

            {/* Line Path */}
            <path d={pathD} fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

            {/* Pulse on latest point */}
            <circle cx={lastPoint[0]} cy={lastPoint[1]} r="4" fill="#22d3ee" className="animate-ping opacity-75" />
            <circle cx={lastPoint[0]} cy={lastPoint[1]} r="4" fill="#0891b2" stroke="#fff" strokeWidth="1.5" />
          </svg>
        )}
      </div>

      {/* Range Labels */}
      <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mt-1">
        <span>Mín: {minVal.toFixed(1)}</span>
        <span className="text-cyan-400">● En vivo</span>
        <span>Máx: {maxVal.toFixed(1)}</span>
      </div>
    </div>
  )
}
