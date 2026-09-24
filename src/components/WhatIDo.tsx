import { site } from '../content/site'
import './WhatIDo.css'

export function WhatIDo() {
  return (
    <section id="what" className="section what" aria-labelledby="what-title">
      <div className="section-head">
        <h2 id="what-title">What I do</h2>
      </div>
      <ul className="what-grid">
        {site.whatIDo.map((item) => (
          <li key={item.title} className="what-card card ink-card">
            <h3>{item.title}</h3>
            <p>{item.blurb}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
