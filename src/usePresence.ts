import { useEffect, useState } from 'react'

const MOTION_QUERY = '(prefers-reduced-motion: reduce)'

/** Keeps `value` mounted through the exit so CSS can animate closed. */
export function usePresence<T>(value: T | null, duration = 280) {
  const [rendered, setRendered] = useState<T | null>(value)
  const [open, setOpen] = useState(false)

  if (value != null && rendered !== value) {
    setRendered(value)
    setOpen(false)
  }

  useEffect(() => {
    const reduce = window.matchMedia(MOTION_QUERY).matches
    if (value != null) {
      if (reduce) {
        setOpen(true)
        return
      }
      const id = requestAnimationFrame(() => setOpen(true))
      return () => cancelAnimationFrame(id)
    }

    setOpen(false)
    const id = window.setTimeout(() => setRendered(null), reduce ? 0 : duration)
    return () => window.clearTimeout(id)
  }, [value, duration])

  return { rendered, open }
}
