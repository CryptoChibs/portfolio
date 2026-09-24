import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { site } from '../content/site'
import './Experience.css'

type Job = (typeof site.experience)[number]

function jobHasMore(job: Job) {
  if ('supportMetrics' in job || 'detail' in job || 'impactStoryId' in job) return true
  if (!('links' in job)) return false
  return (job as { links: readonly unknown[] }).links.length > 0
}

function ExperiencePanel({
  job,
  onClose,
}: {
  job: Job
  onClose: () => void
}) {
  const titleId = useId()
  const supportMetrics = 'supportMetrics' in job ? job.supportMetrics : undefined
  const detail = 'detail' in job ? job.detail : undefined
  const location = 'location' in job ? job.location : undefined
  const impactStoryId = 'impactStoryId' in job ? job.impactStoryId : undefined
  const links =
    'links' in job && job.links?.length
      ? job.links
      : job.href.startsWith('http')
        ? [{ label: `Visit ${job.org}`, href: job.href }]
        : []
  const story = impactStoryId
    ? site.impactStories.find((s) => s.id === impactStoryId)
    : undefined
  const shots = story && 'shots' in story ? story.shots : undefined
  const [openShot, setOpenShot] = useState<NonNullable<typeof shots>[number] | null>(null)

  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.body.classList.add('exp-panel-open')
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (openShot) setOpenShot(null)
      else onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      document.body.classList.remove('exp-panel-open')
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose, openShot])

  return createPortal(
    <div className="exp-panel-root" role="presentation">
      <button type="button" className="exp-panel-backdrop" aria-label="Close details" onClick={onClose} />
      <aside
        className="exp-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header className="exp-panel-header">
          <div>
            <h3 id={titleId}>{job.org}</h3>
            <p className="exp-panel-role">{job.role}</p>
            <p className="exp-panel-meta">
              {job.dates}
              {location ? ` · ${location}` : ''}
            </p>
          </div>
          <button type="button" className="exp-panel-close" onClick={onClose}>
            Close
          </button>
        </header>

        <div className="exp-panel-body">
          <p className="exp-panel-blurb">{job.blurb}</p>

          {supportMetrics ? (
            <section className="exp-panel-block">
              <h4>{supportMetrics.title}</h4>
              <ul className="exp-metrics-list">
                {supportMetrics.stats.map((s) => (
                  <li key={s.label}>
                    <strong>{s.value}</strong>
                    <span>{s.label}</span>
                  </li>
                ))}
              </ul>
              <p className="exp-metrics-note">{supportMetrics.note}</p>
            </section>
          ) : null}

          {detail ? (
            <section className="exp-panel-block">
              <h4>{detail.title}</h4>
              <ul className="exp-panel-bullets">
                {detail.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {story ? (
            <section className="exp-panel-block">
              <h4>Impact story</h4>
              <p className="exp-panel-story-title">{story.title}</p>
              <dl className="exp-panel-story">
                <div>
                  <dt>Context</dt>
                  <dd>{story.context}</dd>
                </div>
                <div>
                  <dt>Challenge</dt>
                  <dd>{story.challenge}</dd>
                </div>
                <div>
                  <dt>My role</dt>
                  <dd>{story.role}</dd>
                </div>
                <div>
                  <dt>Outcome</dt>
                  <dd>{story.outcome}</dd>
                </div>
              </dl>
              {shots?.length ? (
                <ul className="exp-story-shots">
                  {shots.map((shot) => (
                    <li key={shot.src}>
                      <button
                        type="button"
                        className="exp-story-shot"
                        onClick={() => setOpenShot(shot)}
                        aria-label={`Open ${shot.label}`}
                      >
                        <img src={shot.src} alt={shot.label} />
                      </button>
                      <p>{shot.label}</p>
                    </li>
                  ))}
                </ul>
              ) : null}
              <div className="exp-tags">
                {story.tags.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
            </section>
          ) : null}

          {links.length > 0 ? (
            <ul className="exp-panel-links">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    className="exp-panel-link"
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                    onClick={link.href.startsWith('#') ? onClose : undefined}
                  >
                    {link.label} →
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </aside>
      {openShot ? (
        <div
          className="exp-shot-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={openShot.label}
          onClick={() => setOpenShot(null)}
        >
          <button
            type="button"
            className="exp-shot-lightbox-close"
            aria-label="Close screenshot"
            onClick={() => setOpenShot(null)}
          >
            ×
          </button>
          <figure onClick={(e) => e.stopPropagation()}>
            <img src={openShot.src} alt={openShot.label} />
            <figcaption>{openShot.label}</figcaption>
          </figure>
        </div>
      ) : null}
    </div>,
    document.body,
  )
}

const NARROW_EXP = '(max-width: 720px)'

export function Experience() {
  const [openId, setOpenId] = useState<string | null>(null)
  const [highlightId, setHighlightId] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set())
  const highlightTimer = useRef<number | null>(null)
  const openJob = site.experience.find((j) => j.id === openId) ?? null

  useEffect(() => {
    if (!highlightId) return
    const timer = window.setTimeout(() => setHighlightId(null), 4000)
    return () => window.clearTimeout(timer)
  }, [highlightId])

  useEffect(() => {
    return () => {
      if (highlightTimer.current) window.clearTimeout(highlightTimer.current)
    }
  }, [])

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const jumpToExperience = (id: string) => {
    const el = document.getElementById(`exp-${id}`)
    if (!el) return
    if (highlightTimer.current) window.clearTimeout(highlightTimer.current)
    setHighlightId(null)
    if (window.matchMedia(NARROW_EXP).matches) {
      setExpanded((prev) => new Set(prev).add(id))
    }
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    // wait for smooth scroll to settle, then pulse (otherwise it fades before you arrive)
    highlightTimer.current = window.setTimeout(() => {
      setHighlightId(id)
    }, 450)
  }

  return (
    <section id="experience" className="section experience" aria-labelledby="experience-title">
      <div className="section-head is-centered">
        <h2 id="experience-title">Experience</h2>
      </div>

      <div className="career-progression card ink-card">
        <p className="career-progression-line">{site.careerProgression.line}</p>
        <p className="career-progression-caption">{site.careerProgression.caption}</p>
      </div>

      <ol className="timeline">
        {site.timeline.map((row) => (
          <li key={row.id}>
            <a
              className="timeline-row card ink-card"
              href={`#exp-${row.id}`}
              onClick={(e) => {
                e.preventDefault()
                jumpToExperience(row.id)
                window.history.replaceState(null, '', `#exp-${row.id}`)
              }}
            >
              <span className="timeline-dates">{row.dates}</span>
              <span className="timeline-role">{row.role}</span>
              <span className="timeline-org">{row.org}</span>
            </a>
          </li>
        ))}
      </ol>

      <ul className="exp-list">
        {site.experience.map((job) => {
          const location = 'location' in job ? job.location : undefined
          const hasMore = jobHasMore(job)

          const isOpen = expanded.has(job.id)

          return (
            <li key={job.id} id={`exp-${job.id}`}>
              <article
                className={`exp-card card ink-card${
                  highlightId === job.id ? ' is-highlighted' : ''
                }${isOpen ? ' is-open' : ''}`}
                onClick={(e) => {
                  if (!window.matchMedia(NARROW_EXP).matches) return
                  if ((e.target as HTMLElement).closest('a, button')) return
                  toggleExpanded(job.id)
                }}
              >
                <div className="exp-top">
                  <h3>{job.org}</h3>
                  <span className="exp-role">{job.role}</span>
                  <span className="exp-dates">{job.dates}</span>
                  {location ? <span className="exp-location">{location}</span> : null}
                  <span className="exp-peek">See details</span>
                </div>
                <div className="exp-body">
                  <div className="exp-body-inner">
                  <p>{job.blurb}</p>
                  <div className="exp-tags">
                    {job.tags.map((t) => (
                      <span key={t} className="tag">
                        {t}
                      </span>
                    ))}
                  </div>
                  {hasMore ? (
                    <button
                      type="button"
                      className="exp-more"
                      onClick={() => setOpenId(job.id)}
                    >
                      Learn more →
                    </button>
                  ) : job.href.startsWith('http') ? (
                    <a
                      className="exp-more"
                      href={job.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Visit →
                    </a>
                  ) : null}
                  </div>
                </div>
              </article>
            </li>
          )
        })}
      </ul>

      {openJob ? <ExperiencePanel job={openJob} onClose={() => setOpenId(null)} /> : null}
    </section>
  )
}
