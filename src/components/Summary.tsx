import { site } from '../content/site'
import './Summary.css'

export function Summary() {
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
      <ul className="highlights-list">
        {site.highlights.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>
    </section>
  )
}
