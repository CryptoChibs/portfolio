import { site } from '../content/site'
import './HowIWork.css'

export function HowIWork() {
  return (
    <section id="process" className="section how" aria-labelledby="process-title">
      <div className="section-head is-centered">
        <h2 id="process-title">How I work</h2>
      </div>
      <ol className="how-steps">
        {site.howIWork.map((step, i) => (
          <li key={step.id} className="how-step card ink-card">
            <span className="how-index">{String(i + 1).padStart(2, '0')}</span>
            <h3>{step.title}</h3>
            <p>{step.blurb}</p>
          </li>
        ))}
      </ol>
      <aside className="how-ownership card ink-card">
        <h3>{site.howIWorkOwnership.title}</h3>
        <p>{site.howIWorkOwnership.body}</p>
      </aside>
    </section>
  )
}
