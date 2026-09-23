import { site } from '../content/site'
import './Skills.css'

export function Skills() {
  return (
    <section id="skills" className="section skills" aria-labelledby="skills-title">
      <div className="section-head">
        <h2 id="skills-title">Skills & tools</h2>
      </div>

      <h3 className="skills-sub">Core competencies</h3>
      <ul className="skills-grid">
        {site.competencies.map((group) => (
          <li key={group.title} className="skills-card card ink-card">
            <h4>{group.title}</h4>
            <div className="skills-tags">
              {group.items.map((item) => (
                <span key={item} className="tag">
                  {item}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>

      <h3 className="skills-sub">Technical skills & tools</h3>
      <ul className="skills-grid">
        {site.tools.map((group) => (
          <li key={group.title} className="skills-card card ink-card">
            <h4>{group.title}</h4>
            <div className="skills-tags">
              {group.items.map((item) => (
                <span key={item} className="tag">
                  {item}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
