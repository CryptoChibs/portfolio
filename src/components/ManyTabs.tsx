import { site } from '../content/site'
import './ManyTabs.css'

export function ManyTabs() {
  return (
    <section id="tabs" className="section many-tabs" aria-labelledby="tabs-title">
      <div className="section-head">
        <h2 id="tabs-title">{site.manyTabs.title}</h2>
      </div>
      <ul className="many-tabs-grid">
        {site.manyTabs.labels.map((label) => (
          <li key={label}>{label}</li>
        ))}
      </ul>
    </section>
  )
}
