import { useEffect, useId, useRef, useState } from 'react'
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

const MOBILE_NAV = '(max-width: 720px)'

export function Nav() {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const menuId = useId()

  useEffect(() => {
    if (!open) return

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      toggleRef.current?.focus()
    }

    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_NAV)
    const onChange = () => {
      if (!mq.matches) setOpen(false)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const close = () => setOpen(false)

  return (
    <div className={`nav-wrap${open ? ' is-open' : ''}`} ref={wrapRef}>
      {open ? (
        <button type="button" className="nav-backdrop" aria-label="Close menu" onClick={close} />
      ) : null}
      <header className="nav">
        <a className="nav-brand" href="#home" onClick={close}>
          {site.fullName}
        </a>
        <button
          ref={toggleRef}
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="nav-toggle-icon" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
        </button>
        <nav id={menuId} className="nav-menu" aria-label="Primary">
          <ul className="nav-links">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={close}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>
    </div>
  )
}
