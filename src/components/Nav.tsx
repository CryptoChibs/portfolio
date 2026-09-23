import { site } from '../content/site'
import './Nav.css'

const links = [
  { href: '#home', label: 'Home' },
  { href: '#summary', label: 'About' },
  { href: '#cases', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#creative', label: 'Creative' },
  { href: '#skills', label: 'Skills' },
  { href: '#contact', label: 'Contact' },
]

export function Nav() {
  return (
    <div className="nav-wrap">
      <header className="nav">
        <a className="nav-brand" href="#home">
          {site.fullName}
        </a>
        <nav aria-label="Primary">
          <ul className="nav-links">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </header>
    </div>
  )
}
