import { useState } from 'react'
import './Pebble.css'

export const PEBBLE_FACES = [
  '/Characters/1.png',
  '/Characters/2.png',
  '/Characters/3.png',
  '/Characters/4.png',
  '/Characters/5.png',
] as const

export type PebbleFace = 1 | 2 | 3 | 4 | 5

type PebbleProps = {
  className?: string
  /** Larger standalone render (e.g. hero) vs tiny absolute cameo */
  size?: 'sm' | 'lg'
  /** 1.png – 5.png */
  face?: PebbleFace
  /** Click cycles faces (hero). */
  interactive?: boolean
}

/** Round sage-green dino-suit penguin. */
export function Pebble({
  className = '',
  size = 'sm',
  face = 1,
  interactive = false,
}: PebbleProps) {
  const start = face - 1
  const [index, setIndex] = useState(start)
  const current = interactive ? index : start
  const src = PEBBLE_FACES[current]
  const n = current + 1

  const img = <img src={src} alt="" />

  if (interactive) {
    return (
      <button
        type="button"
        className={`pebble pebble-${size} pebble-interactive ${className}`.trim()}
        title="Pebble"
        aria-label={`Pebble, pose ${n} of 5. Click to try the next one.`}
        onClick={() => setIndex((i) => (i + 1) % PEBBLE_FACES.length)}
      >
        {img}
      </button>
    )
  }

  return (
    <div className={`pebble pebble-${size} ${className}`.trim()} title="Pebble">
      {img}
    </div>
  )
}
