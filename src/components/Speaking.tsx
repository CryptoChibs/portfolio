import { site } from '../content/site'
import './Speaking.css'

export function Speaking() {
  return (
    <section id="speaking" className="section speaking" aria-labelledby="speaking-title">
      <div className="section-head">
        <h2 id="speaking-title">Speaking & community leadership</h2>
      </div>

      <ul className="speaking-metrics">
        {site.speaking.hosted.map((item) => {
          const href = 'href' in item ? item.href : undefined
          const body = (
            <>
              <div className="speaking-value">{item.value}</div>
              <div className="speaking-label">{item.label}</div>
            </>
          )

          return (
            <li key={item.label}>
              {href ? (
                <a
                  className="speaking-metric card ink-card"
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {body}
                </a>
              ) : (
                <div className="speaking-metric card ink-card">{body}</div>
              )}
            </li>
          )
        })}
      </ul>

      <div className="speaking-also">
        <p className="speaking-also-label">Also</p>
        <ul className="speaking-also-list">
          {site.speaking.additional.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
