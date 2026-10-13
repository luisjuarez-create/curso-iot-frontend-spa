import React, { useRef, useState } from 'react'
import { Send, Eraser, Contrast } from 'lucide-react'

export const MATRIX_ROWS = 8
export const MATRIX_COLS = 13

const emptyGrid = () => Array.from({ length: MATRIX_ROWS }, () => Array(MATRIX_COLS).fill(false))

const fromRows = (rows) => rows.map((row) => [...row].map((c) => c === '1'))

const toRows = (grid) => grid.map((row) => row.map((on) => (on ? '1' : '0')).join(''))

function isValidRows(value) {
  return (
    Array.isArray(value) &&
    value.length === MATRIX_ROWS &&
    value.every((row) => typeof row === 'string' && row.length === MATRIX_COLS && /^[01]+$/.test(row))
  )
}

const PRESETS = [
  {
    label: 'Corazón',
    rows: [
      '0001100011000',
      '0011110111100',
      '0011111111100',
      '0011111111100',
      '0001111111000',
      '0000111110000',
      '0000011100000',
      '0000001000000',
    ],
  },
  {
    label: 'Carita',
    rows: [
      '0000000000000',
      '0001100011000',
      '0001100011000',
      '0000000000000',
      '0010000000100',
      '0001000001000',
      '0000111110000',
      '0000000000000',
    ],
  },
]

export function MatrixDrawWidget({ commandKey, reported, enabled, onSend }) {
  const reportedRows = isValidRows(reported) ? reported : null
  const reportedKey = reportedRows ? reportedRows.join('') : null

  const [grid, setGrid] = useState(() => (reportedRows ? fromRows(reportedRows) : emptyGrid()))
  const [sentKey, setSentKey] = useState(null)
  const gridRef = useRef(null)
  const paintRef = useRef(null)

  const cellAt = (e) => {
    const rect = gridRef.current.getBoundingClientRect()
    const col = Math.floor(((e.clientX - rect.left) / rect.width) * MATRIX_COLS)
    const row = Math.floor(((e.clientY - rect.top) / rect.height) * MATRIX_ROWS)
    if (row < 0 || row >= MATRIX_ROWS || col < 0 || col >= MATRIX_COLS) return null
    return [row, col]
  }

  const paint = (row, col, value) => {
    setGrid((prev) => {
      if (prev[row][col] === value) return prev
      const next = prev.map((r) => [...r])
      next[row][col] = value
      return next
    })
  }

  // Si el trazo empieza en un pixel encendido, borra; si no, dibuja.
  const handlePointerDown = (e) => {
    const cell = cellAt(e)
    if (!cell) return
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    const value = !grid[cell[0]][cell[1]]
    paintRef.current = value
    paint(cell[0], cell[1], value)
  }

  const handlePointerMove = (e) => {
    if (paintRef.current === null) return
    const cell = cellAt(e)
    if (cell) paint(cell[0], cell[1], paintRef.current)
  }

  const stopPainting = () => {
    paintRef.current = null
  }

  const send = () => {
    const rows = toRows(grid)
    if (onSend({ [commandKey]: rows })) setSentKey(rows.join(''))
  }

  const litCount = grid.reduce((n, row) => n + row.filter(Boolean).length, 0)

  let statusText = reportedKey ? 'Dibujo actual en el dispositivo' : 'Sin dibujo reportado'
  let statusClass = 'text-slate-500'
  if (!enabled) {
    statusText = 'Sin conexión al broker'
    statusClass = 'text-rose-400'
  } else if (sentKey && sentKey !== reportedKey) {
    statusText = 'Enviado, esperando confirmación…'
    statusClass = 'text-cyan-400'
  } else if (sentKey && sentKey === reportedKey) {
    statusText = 'Mostrado en la matriz'
    statusClass = 'text-emerald-400'
  }

  return (
    <div className="flex flex-col gap-2.5">
      <div
        ref={gridRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopPainting}
        onPointerCancel={stopPainting}
        className="grid gap-[3px] p-2 rounded-xl bg-slate-950 border border-slate-800 cursor-crosshair touch-none w-full max-w-md mx-auto"
        style={{ gridTemplateColumns: `repeat(${MATRIX_COLS}, minmax(0, 1fr))` }}
      >
        {grid.map((row, r) =>
          row.map((on, c) => (
            <div
              key={`${r}-${c}`}
              className={`aspect-square rounded-full transition-colors duration-75 ${
                on ? 'bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.8)]' : 'bg-slate-800'
              }`}
            />
          ))
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => setGrid(fromRows(p.rows))}
            className="px-2 py-1 rounded-lg border border-slate-700 bg-slate-800/60 text-[10px] font-semibold text-slate-300 hover:border-slate-500 hover:text-white transition"
          >
            {p.label}
          </button>
        ))}
        <button
          onClick={() => setGrid((prev) => prev.map((row) => row.map((on) => !on)))}
          title="Invertir"
          className="flex items-center gap-1 px-2 py-1 rounded-lg border border-slate-700 bg-slate-800/60 text-[10px] font-semibold text-slate-300 hover:border-slate-500 hover:text-white transition"
        >
          <Contrast className="w-3 h-3" />
          Invertir
        </button>
        <button
          onClick={() => setGrid(emptyGrid())}
          title="Limpiar"
          className="flex items-center gap-1 px-2 py-1 rounded-lg border border-slate-700 bg-slate-800/60 text-[10px] font-semibold text-slate-300 hover:border-rose-500/60 hover:text-rose-300 transition"
        >
          <Eraser className="w-3 h-3" />
          Limpiar
        </button>
      </div>

      <button
        onClick={send}
        disabled={!enabled}
        className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-slate-950 text-xs font-bold shadow-lg shadow-sky-500/20 active:scale-95 transition disabled:opacity-40 disabled:pointer-events-none"
      >
        <Send className="w-3.5 h-3.5" />
        Enviar dibujo
        <span className="font-mono font-normal opacity-70">({litCount}/{MATRIX_ROWS * MATRIX_COLS})</span>
      </button>

      <span className={`text-center text-[10px] ${statusClass}`}>{statusText}</span>
    </div>
  )
}
