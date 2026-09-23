import { site } from '../content/site'
import './FeaturedWork.css'

export function FeaturedWork() {
  return (
    <section id="featured" className="section featured-home" aria-labelledby="featured-title">
      <div className="section-head">
        <h2 id="featured-title">Featured work</h2>
        <p>Highlights - jump into a full project card, or open a live link.</p>
      </div>
      <ul className="featured-grid">
        {site.featuredWork.map((item) => (
          <li key={item.id}>
            <a className="featured-card card ink-card" href={item.href}>
              <h3>{item.title}</h3>
              <p>{item.blurb}</p>
              <span className="featured-go">View project →</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="featured-links card ink-card">
        <h3>Also online</h3>
        <ul>
          {site.featuredLinks.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
