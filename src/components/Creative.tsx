import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { site } from '../content/site'
import './Creative.css'

type Project = (typeof site.galleryProjects)[number]
type Kind = (typeof site.galleryKinds)[number]

const PAGE_SIZE = 6

type PagerToken = number | 'ellipsis'

/** First/last few, plus the current page. Gaps become an ellipsis. */
function galleryPager(current: number, total: number): PagerToken[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i)

  const want = new Set<number>()
  const nearStart = current < 3
  const nearEnd = current > total - 4

  if (nearStart || nearEnd) {
    for (let i = 0; i < 3; i++) want.add(i)
    for (let i = total - 3; i < total; i++) want.add(i)
  }

  want.add(0)
  want.add(total - 1)
  for (let i = current - 1; i <= current + 1; i++) {
    if (i >= 0 && i < total) want.add(i)
  }

  const sorted = [...want].sort((a, b) => a - b)
  const out: PagerToken[] = []
  for (let i = 0; i < sorted.length; i++) {
    const n = sorted[i]
    const prev = sorted[i - 1]
    if (i > 0 && n - prev === 2) out.push(prev + 1)
    else if (i > 0 && n - prev > 1) out.push('ellipsis')
    out.push(n)
  }
  return out
}

export function Creative() {
  const [project, setProject] = useState<Project>('All')
  const [kind, setKind] = useState<Kind>('All')
  const [page, setPage] = useState(0)
  const [lightbox, setLightbox] = useState<(typeof site.gallery)[number] | null>(null)

  const projectSelected = project !== 'All'

  const kindsForProject = useMemo(() => {
    if (!projectSelected) return [] as Kind[]
    return site.galleryKinds.filter(
      (k) =>
        k === 'All' ||
        site.gallery.some((item) => item.project === project && item.kind === k),
    )
  }, [project, projectSelected])

  const items = useMemo(() => {
    return site.gallery.filter((item) => {
      if (projectSelected && item.project !== project) return false
      if (projectSelected && kind !== 'All' && item.kind !== kind) return false
      return true
    })
  }, [project, kind, projectSelected])

  const pageCount = Math.max(1, Math.ceil(items.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount - 1)
  const pageItems = items.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE)

  const selectProject = (next: Project) => {
    setProject(next)
    setKind('All')
    setPage(0)
  }

  const selectKind = (next: Kind) => {
    setKind(next)
    setPage(0)
  }

  useEffect(() => {
    const applyFromHash = () => {
      const raw = window.location.hash
      if (!raw.startsWith('#creative')) return
      const query = raw.includes('?') ? raw.slice(raw.indexOf('?') + 1) : ''
      const projectParam = new URLSearchParams(query).get('project')
      if (!projectParam) return
      const match = site.galleryProjects.find((p) => p === projectParam)
      if (match && match !== 'All') {
        setProject(match)
        setKind('All')
        setPage(0)
      }
    }

    applyFromHash()
    window.addEventListener('hashchange', applyFromHash)
    return () => window.removeEventListener('hashchange', applyFromHash)
  }, [])

  useEffect(() => {
    if (page !== safePage) setPage(safePage)
  }, [page, safePage])

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

  return (
    <section id="creative" className="section creative" aria-labelledby="creative-title">
      <div className="section-head is-centered">
        <h2 id="creative-title">Creative</h2>
      </div>

      <div className="gallery-toolbar">
        <div className="gallery-projects" role="tablist" aria-label="Gallery projects">
          {site.galleryProjects.map((p) => (
            <button
              key={p}
              type="button"
              role="tab"
              aria-selected={project === p}
              className={`gallery-project${project === p ? ' is-active' : ''}`}
              onClick={() => selectProject(p)}
            >
              {p}
            </button>
          ))}
        </div>

        {projectSelected ? (
          <div className="gallery-kinds" role="tablist" aria-label={`${project} categories`}>
            <span className="gallery-kinds-label">Filter</span>
            {kindsForProject.map((k) => (
              <button
                key={k}
                type="button"
                role="tab"
                aria-selected={kind === k}
                className={`gallery-kind${kind === k ? ' is-active' : ''}`}
                onClick={() => selectKind(k)}
              >
                {k}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <ul className="gallery-grid">
        {pageItems.map((item) => {
          const tall = item.fit === 'contain'
          return (
            <li key={item.id} className="gallery-item">
              <figure className={`gallery-figure${tall ? ' is-tall' : ''}`}>
                <button
                  type="button"
                  className="gallery-frame"
                  onClick={() => setLightbox(item)}
                  aria-label={`Open ${item.label}`}
                >
                  <img src={item.src} alt={item.label} loading="lazy" />
                </button>
                <figcaption>
                  <span className="gallery-slot-label">{item.label}</span>
                  <span className="gallery-slot-cat">
                    {item.project} · {item.kind}
                    {/_ES/i.test(item.src) ? ' · LATAM' : ''}
                  </span>
                </figcaption>
              </figure>
            </li>
          )
        })}
      </ul>

      {items.length === 0 ? (
        <p className="gallery-empty">Nothing in this combo yet - try another filter.</p>
      ) : null}

      {items.length > PAGE_SIZE ? (
        <nav className="gallery-pager" aria-label="Gallery pages">
          <button
            type="button"
            className="gallery-pager-btn"
            aria-label="Previous page"
            disabled={safePage === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
            ‹
          </button>
          <div className="gallery-pager-pages">
            {galleryPager(safePage, pageCount).map((token, i) =>
              token === 'ellipsis' ? (
                <span key={`ellipsis-${i}`} className="gallery-pager-ellipsis" aria-hidden="true">
                  ···
                </span>
              ) : (
                <button
                  key={token}
                  type="button"
                  className={`gallery-pager-page${token === safePage ? ' is-active' : ''}`}
                  aria-label={`Page ${token + 1}`}
                  aria-current={token === safePage ? 'page' : undefined}
                  onClick={() => setPage(token)}
                >
                  {token + 1}
                </button>
              ),
            )}
          </div>
          <button
            type="button"
            className="gallery-pager-btn"
            aria-label="Next page"
            disabled={safePage >= pageCount - 1}
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
          >
            ›
          </button>
        </nav>
      ) : null}

      {lightbox
        ? createPortal(
            <div
              className="gallery-lightbox"
              role="dialog"
              aria-modal="true"
              aria-label={lightbox.label}
              onClick={() => setLightbox(null)}
            >
              <button
                type="button"
                className="gallery-lightbox-close"
                aria-label="Close"
                onClick={() => setLightbox(null)}
              >
                ×
              </button>
              <img
                src={lightbox.src}
                alt={lightbox.label}
                onClick={(e) => e.stopPropagation()}
              />
            </div>,
            document.body,
          )
        : null}
    </section>
  )
}
