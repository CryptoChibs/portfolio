import { site } from '../content/site'
import './Vision.css'

export function Vision() {
  const vision = site.careerVision

  return (
    <section id="vision" className="section vision" aria-labelledby="vision-title">
      <div className="section-head">
        <h2 id="vision-title">Career vision & next</h2>
        <p>Where I&apos;m headed - and what I&apos;m building toward.</p>
      </div>

      <div className="vision-prose">
        <p className="vision-lead">{vision.lead}</p>
        {vision.paragraphs.map((p) => (
          <p key={p.slice(0, 48)}>{p}</p>
        ))}
      </div>

      <div className="vision-prose">
        <h3>Community</h3>
        <p>{vision.community}</p>
      </div>

      <div className="vision-prose">
        <h3>What I&apos;m looking for</h3>
        <p className="vision-looking-intro">I&apos;m particularly interested in remote roles where I can:</p>
        <ul className="vision-looking">
          {vision.lookingFor.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="vision-dev card ink-card">
        <h3>Professional development</h3>
        <div className="skills-tags">
          {site.professionalDevelopment.map((item) => (
            <span key={item} className="tag">
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
