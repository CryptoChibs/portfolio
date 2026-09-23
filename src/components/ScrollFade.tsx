import { useEffect } from 'react'

/** Soft fade only at the bottom of the viewport. */
export function ScrollFade() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    const nodes = () =>
      Array.from(document.querySelectorAll<HTMLElement>('[data-scroll-fade]'))

    let ticking = false

    const update = () => {
      ticking = false
      const vh = window.innerHeight
      const fadeStart = vh * 0.72
      const fadeEnd = vh * 0.98

      for (const el of nodes()) {
        const rect = el.getBoundingClientRect()
        const anchor = rect.top + Math.min(rect.height * 0.25, 80)

        let opacity = 1
        if (anchor > fadeStart) {
          opacity = 1 - (anchor - fadeStart) / (fadeEnd - fadeStart)
        }

        opacity = Math.max(0, Math.min(1, opacity))
        const lift = (1 - opacity) * 18
        el.style.opacity = String(opacity)
        el.style.transform = `translate3d(0, ${lift}px, 0)`
      }
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return null
}
