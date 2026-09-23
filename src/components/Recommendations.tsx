import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { createPortal } from 'react-dom'
import { site } from '../content/site'
import './Recommendations.css'

type QuoteSlide = {
  kind: 'quote'
  id: string
  name: string
  role: string
  context: string
  quote: string
  href: string
  image: string
}

type ShotSlide = {
  kind: 'shot'
  id: string
  label: string
  src: string
}

type Slide = QuoteSlide | ShotSlide

const slides: Slide[] = [
  ...site.recommendations
    .filter((r) => r.quote.trim().length > 0)
    .map(
      (r): QuoteSlide => ({
        kind: 'quote',
        id: `quote-${r.name}`,
        name: r.name,
        role: r.role,
        context: r.context,
        quote: r.quote,
        href: r.href,
        image: r.image,
      }),
    ),
  ...(site.recommendationShots ?? []).map(
    (s): ShotSlide => ({
      kind: 'shot',
      id: s.id,
      label: s.label,
      src: s.src,
    }),
  ),
]

export function Recommendations() {
  const [index, setIndex] = useState(0)
  const [lightbox, setLightbox] = useState<ShotSlide | null>(null)
  const suppressClick = useRef(false)
  const total = slides.length
  const current = slides[index]

  const go = (dir: -1 | 1) => {
    if (total < 2) return
    setIndex((i) => (i + dir + total) % total)
  }

  const onFramePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (total < 2 || lightbox) return
    if ((e.target as HTMLElement).closest('a, .rec-carousel-nav')) return

    suppressClick.current = false
    const startX = e.clientX
    const startY = e.clientY
    const pointerId = e.pointerId

    const finish = (ev: PointerEvent) => {
      if (ev.pointerId !== pointerId) return
      cleanup()
      const dx = ev.clientX - startX
      const dy = ev.clientY - startY
      if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.2) return
      suppressClick.current = true
      go(dx < 0 ? 1 : -1)
    }
    const cancel = (ev: PointerEvent) => {
      if (ev.pointerId !== pointerId) return
      cleanup()
    }
    const cleanup = () => {
      window.removeEventListener('pointerup', finish)
      window.removeEventListener('pointercancel', cancel)
    }

    window.addEventListener('pointerup', finish)
    window.addEventListener('pointercancel', cancel)
  }

  useEffect(() => {
    if (!lightbox) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [lightbox])

  useEffect(() => {
    if (lightbox || total < 2) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + total) % total)
      if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % total)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, total])

  if (!current) return null

  return (
    <section
      id="recommendations"
      className="section recommendations"
      aria-labelledby="recommendations-title"
    >
      <div className="section-head">
        <h2 id="recommendations-title">Recommendations</h2>
      </div>

      <div
        className="rec-carousel"
        role="region"
        aria-roledescription="carousel"
        aria-label="Recommendations"
      >
        <div className="rec-carousel-frame" onPointerDown={onFramePointerDown}>
          {current.kind === 'quote' ? (
            <article className="rec-square card ink-card">
              <header className="rec-square-head">
                {current.image ? (
                  <img className="rec-photo" src={current.image} alt="" width={52} height={52} />
                ) : (
                  <span className="rec-avatar" aria-hidden="true">
                    {current.name
                      .split(' ')
                      .map((p) => p[0])
                      .slice(0, 2)
                      .join('')}
                  </span>
                )}
                <div className="rec-meta">
                  {current.href ? (
                    <a href={current.href} target="_blank" rel="noreferrer">
                      {current.name}
                    </a>
                  ) : (
                    <strong>{current.name}</strong>
                  )}
                  {current.role ? <span className="rec-role">{current.role}</span> : null}
                  {current.context ? <span className="rec-context">{current.context}</span> : null}
                </div>
              </header>
              <blockquote className="rec-quote">{current.quote}</blockquote>
            </article>
          ) : (
            <button
              type="button"
              className="rec-shot card ink-card"
              onClick={() => {
                if (suppressClick.current) {
                  suppressClick.current = false
                  return
                }
                setLightbox(current)
              }}
              aria-label={`Open ${current.label}`}
            >
              <span className="rec-shot-label">{current.label}</span>
              <span className="rec-shot-frame">
                <img key={current.id} src={current.src} alt="" />
              </span>
            </button>
          )}
        </div>

        <div className="rec-carousel-controls">
          <button
            type="button"
            className="rec-carousel-nav rec-carousel-nav--prev"
            aria-label="Previous"
            onClick={() => go(-1)}
            disabled={total < 2}
          >
            ‹
          </button>

          {total > 1 ? (
            <div className="rec-carousel-dots" role="tablist" aria-label="Slides">
              {slides.map((slide, i) => (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={slide.kind === 'quote' ? slide.name : slide.label}
                  className={`rec-carousel-dot${i === index ? ' is-active' : ''}`}
                  onClick={() => setIndex(i)}
                />
              ))}
            </div>
          ) : null}

          <button
            type="button"
            className="rec-carousel-nav rec-carousel-nav--next"
            aria-label="Next"
            onClick={() => go(1)}
            disabled={total < 2}
          >
            ›
          </button>
        </div>

        <div className="rec-carousel-meta">
          <span className="rec-carousel-count">
            {index + 1} / {total}
          </span>
        </div>
      </div>

      {lightbox
        ? createPortal(
            <div
              className="rec-lightbox"
              role="dialog"
              aria-modal="true"
              aria-label={lightbox.label}
              onClick={() => setLightbox(null)}
            >
              <button
                type="button"
                className="rec-lightbox-close"
                aria-label="Close"
                onClick={() => setLightbox(null)}
              >
                ×
              </button>
              <img src={lightbox.src} alt={lightbox.label} onClick={(e) => e.stopPropagation()} />
            </div>,
            document.body,
          )
        : null}
    </section>
  )
}
