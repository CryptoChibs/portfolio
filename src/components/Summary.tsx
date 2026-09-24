import { useState } from 'react'
import { site } from '../content/site'
import './Summary.css'

const HIGHLIGHT_PREVIEW = 3

export function Summary() {
  const [highlightsOpen, setHighlightsOpen] = useState(false)
  const hasMore = site.highlights.length > HIGHLIGHT_PREVIEW

  return (
    <section id="summary" className="section summary" aria-labelledby="summary-title">
      <div className="section-head">
        <h2 id="summary-title">Professional summary</h2>
        <p>Community, customer success, product ops - and skills that travel.</p>
      </div>

      <div className="summary-body">
        {site.summary.map((para) => (
          <p key={para.slice(0, 32)}>{para}</p>
        ))}
      </div>

      <h3 className="highlights-title">Career highlights</h3>
      <ul className={`highlights-list${highlightsOpen ? ' is-open' : ''}`}>
        {site.highlights.map((h) => (
          <li key={h}>
            <span className="highlights-text">{h}</span>
          </li>
        ))}
      </ul>
      {hasMore ? (
        <button
          type="button"
          className="highlights-more"
          aria-expanded={highlightsOpen}
          onClick={() => setHighlightsOpen((open) => !open)}
        >
          {highlightsOpen ? 'Show less' : 'Show the rest'}
        </button>
      ) : null}
    </section>
  )
}
