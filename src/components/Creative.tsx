import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { site } from '../content/site'
import { usePresence } from '../usePresence'
import './Creative.css'

type Project = (typeof site.galleryProjects)[number]
type Kind = (typeof site.galleryKinds)[number]

const WIDE_PAGE_SIZE = 6
const NARROW_PAGE_SIZE = 4
const NARROW_GALLERY = '(max-width: 800px)'

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

type ScrollEdges = { start: boolean; end: boolean }

function useScrollEdges(
  ref: { current: HTMLDivElement | null },
  key: string,
  setEdges: (next: ScrollEdges | ((prev: ScrollEdges) => ScrollEdges)) => void,
) {
  useEffect(() => {
    const el = ref.current
    if (!el) {
      setEdges((prev) => (prev.start || prev.end ? { start: false, end: false } : prev))
      return
    }
    let alive = true
    const update = () => {
      const max = el.scrollWidth - el.clientWidth
      const start = el.scrollLeft > 6
      const end = max - el.scrollLeft > 6
      setEdges((prev) => (prev.start === start && prev.end === end ? prev : { start, end }))
    }
    update()
    el.addEventListener('scroll', update, { passive: true })
    const ro = new ResizeObserver(update)
    ro.observe(el)
    document.fonts?.ready.then(() => {
      if (alive) update()
    })
    return () => {
      alive = false
      el.removeEventListener('scroll', update)
      ro.disconnect()
    }
  }, [ref, key, setEdges])
}

export function Creative() {
  const [project, setProject] = useState<Project>('All')
  const [kind, setKind] = useState<Kind>('All')
  const [page, setPage] = useState(0)
  const [lightbox, setLightbox] = useState<(typeof site.gallery)[number] | null>(null)
  const shownLightbox = usePresence(lightbox, 280)
  const [pageSize, setPageSize] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia(NARROW_GALLERY).matches
      ? NARROW_PAGE_SIZE
      : WIDE_PAGE_SIZE,
  )
  const projectsRef = useRef<HTMLDivElement>(null)
  const kindsRef = useRef<HTMLDivElement>(null)
  const [projectEdges, setProjectEdges] = useState<ScrollEdges>({ start: false, end: false })
  const [kindEdges, setKindEdges] = useState<ScrollEdges>({ start: false, end: false })

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

  const pageCount = Math.max(1, Math.ceil(items.length / pageSize))
  const safePage = Math.min(page, pageCount - 1)
  const pageItems = items.slice(safePage * pageSize, safePage * pageSize + pageSize)
  const pageSig = pageItems.map((item) => item.id).join('|')
  const [gridItems, setGridItems] = useState(pageItems)
  const [leavingItems, setLeavingItems] = useState<typeof pageItems | null>(null)
  const gridSig = useRef(pageSig)
  const gridItemsRef = useRef(pageItems)

  const selectProject = (next: Project) => {
    setProject(next)
    setKind('All')
    setPage(0)
  }

  useEffect(() => {
    const row = projectsRef.current
    const active = row?.querySelector<HTMLElement>('.gallery-project.is-active')
    if (!row || !active) return
    const pad = 52
    const left = active.offsetLeft
    const right = left + active.offsetWidth
    const viewLeft = row.scrollLeft + pad
    const viewRight = row.scrollLeft + row.clientWidth - pad
    if (left < viewLeft) row.scrollTo({ left: Math.max(0, left - pad) })
    else if (right > viewRight) row.scrollTo({ left: right - row.clientWidth + pad })
  }, [project])

  useEffect(() => {
    const mq = window.matchMedia(NARROW_GALLERY)
    const onChange = () => setPageSize(mq.matches ? NARROW_PAGE_SIZE : WIDE_PAGE_SIZE)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useScrollEdges(projectsRef, site.galleryProjects.join('|'), setProjectEdges)
  useScrollEdges(kindsRef, kindsForProject.join('|'), setKindEdges)

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
    if (!shownLightbox.rendered) return
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
  }, [shownLightbox.rendered])

  useEffect(() => {
    if (pageSig === gridSig.current) return
    setLeavingItems(gridItemsRef.current)
    gridItemsRef.current = pageItems
    gridSig.current = pageSig
    setGridItems(pageItems)
    const id = window.setTimeout(() => setLeavingItems(null), 320)
    return () => window.clearTimeout(id)
  }, [pageSig, pageItems])

  return (
    <section id="creative" className="section creative" aria-labelledby="creative-title">
      <div className="section-head is-centered">
        <h2 id="creative-title">Creative</h2>
      </div>

      <div className="gallery-toolbar">
        <div className="gallery-scroll">
        <div
          className={`gallery-projects${projectEdges.start ? ' can-scroll-start' : ''}${projectEdges.end ? ' can-scroll-end' : ''}`}
          role="tablist"
          aria-label="Gallery projects"
          ref={projectsRef}
        >
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
        </div>

        {projectSelected ? (
          <div className="gallery-scroll">
          <div
            className={`gallery-kinds${kindEdges.start ? ' can-scroll-start' : ''}${kindEdges.end ? ' can-scroll-end' : ''}`}
            role="tablist"
            aria-label={`${project} categories`}
            ref={kindsRef}
          >
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
          </div>
        ) : null}
      </div>

      <div className="gallery-stage">
        {leavingItems ? (
          <ul className="gallery-grid is-out" aria-hidden="true">
            {leavingItems.map((item) => {
              const tall = item.fit === 'contain'
              return (
                <li key={item.id} className="gallery-item">
                  <figure className={`gallery-figure${tall ? ' is-tall' : ''}`}>
                    <div className="gallery-frame">
                      <img src={item.src} alt="" />
                    </div>
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
        ) : null}
        <ul className={`gallery-grid${leavingItems ? ' is-in' : ''}`}>
          {gridItems.map((item) => {
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
      </div>

      {items.length === 0 ? (
        <p className="gallery-empty">Nothing in this combo yet - try another filter.</p>
      ) : null}

      {items.length > pageSize ? (
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
          <span className="gallery-pager-count">
            {safePage + 1} / {pageCount}
          </span>
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

      {shownLightbox.rendered
        ? createPortal(
            <div
              className={`gallery-lightbox${shownLightbox.open ? ' is-open' : ''}`}
              role="dialog"
              aria-modal="true"
              aria-label={shownLightbox.rendered.label}
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
                src={shownLightbox.rendered.src}
                alt={shownLightbox.rendered.label}
                onClick={(e) => e.stopPropagation()}
              />
            </div>,
            document.body,
          )
        : null}
    </section>
  )
}
