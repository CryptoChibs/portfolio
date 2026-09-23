import { site } from '../content/site'
import './Contact.css'

export function Contact() {
  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="section-head">
        <h2 id="contact-title">Let&apos;s build better communities.</h2>
        <p>You&apos;ve made it all the way here. Say hi - Foquito is waiting by the mailbox.</p>
      </div>
      <div className="contact-actions">
        <a className="btn btn-accent" href={`mailto:${site.links.email}`}>
          Email
        </a>
        <a className="btn btn-ghost" href={site.links.linkedin} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        <a className="btn btn-ghost" href={site.links.x} target="_blank" rel="noreferrer">
          X
        </a>
        <a className="btn btn-ghost" href={site.links.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a className="btn btn-primary" href={site.links.cv} download>
          Download CV
        </a>
      </div>
    </section>
  )
}
