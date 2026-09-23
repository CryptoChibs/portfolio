import { site } from '../content/site'
import { Pebble } from './Pebble'
import './CaseStudies.css'

export function CaseStudies() {
  const lastIndex = site.caseStudies.length - 1

  return (
    <section id="cases" className="section cases" aria-labelledby="cases-title">
      <div className="section-head is-centered">
        <h2 id="cases-title">Project highlights</h2>
      </div>
      <ul className="case-list">
        {site.caseStudies.map((c, index) => {
          const myRole = 'myRole' in c ? c.myRole : undefined
          const roleNote = 'roleNote' in c ? c.roleNote : undefined
          const detail = 'detail' in c ? c.detail : undefined
          const highlight = 'highlight' in c ? c.highlight : undefined
          const images = 'images' in c ? c.images : undefined
          const links = 'links' in c ? c.links : undefined
          const pieces = 'pieces' in c ? c.pieces : undefined
          const piecesTitle =
            'piecesTitle' in c && c.piecesTitle ? c.piecesTitle : 'Selected writing'
          const topics = 'topics' in c ? c.topics : undefined
          const owned = 'owned' in c && c.owned
          const ownershipLabel =
            'ownershipLabel' in c && c.ownershipLabel ? c.ownershipLabel : 'Built by me'
          const hero = images?.[0]
          const extras = images?.slice(1) ?? []
          const isBubble = index === lastIndex

          return (
            <li
              key={c.id}
              id={`case-${c.id}`}
              className={isBubble ? 'case-bubble-item' : undefined}
            >
              <article
                className={`case-card card ink-card${isBubble ? ' case-bubble' : ''}${
                  owned ? ' case-owned' : ''
                }${!hero && pieces?.length ? ' case-card-wide' : ''}`}
              >
                {hero ? (
                  <div className="case-media-wrap">
                    <img className="case-hero" src={hero.src} alt={hero.alt} loading="lazy" />
                    {extras.length > 0 ? (
                      <div className="case-thumbs">
                        {extras.map((img) => (
                          <img key={img.src} src={img.src} alt={img.alt} loading="lazy" />
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : pieces?.length ? null : (
                  <div className="media-slot case-media">{c.mediaLabel}</div>
                )}
                <div className="case-body">
                  <div className="case-title-row">
                    <h3>{c.title}</h3>
                    {owned ? <span className="case-owned-badge">{ownershipLabel}</span> : null}
                  </div>
                  <p>{c.blurb}</p>
                  {highlight ? <p className="case-highlight">{highlight}</p> : null}
                  {detail ? <p className="case-detail">{detail}</p> : null}
                  {topics ? (
                    <div className="case-topics">
                      <h4>{topics.title}</h4>
                      <ul>
                        {topics.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {c.focus.length ? (
                    <div className="case-focus">
                      <h4>Focus</h4>
                      <ul className="case-metrics">
                        {c.focus.map((m) => (
                          <li key={m}>{m}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {myRole ? (
                    <div className="case-role">
                      <h4>My role</h4>
                      <ul className="case-role-list">
                        {myRole.map((r) => (
                          <li key={r}>{r}</li>
                        ))}
                      </ul>
                      {roleNote ? <p className="case-role-note">{roleNote}</p> : null}
                    </div>
                  ) : roleNote ? (
                    <p className="case-role-note case-role-note-solo">{roleNote}</p>
                  ) : null}
                  {pieces?.length ? (
                    <div className="case-pieces">
                      <h4>{piecesTitle}</h4>
                      <ul>
                        {pieces.map((piece) => (
                          <li key={piece.href}>
                            <a href={piece.href} target="_blank" rel="noreferrer">
                              <span className="case-piece-title">{piece.title}</span>
                              <span className="case-piece-blurb">{piece.blurb}</span>
                              {piece.date ? <span className="case-piece-date">{piece.date}</span> : null}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {links?.length ? (
                    <ul className="case-links">
                      {links.map((link) => (
                        <li key={link.href}>
                          <a
                            href={link.href}
                            target={link.href.startsWith('http') ? '_blank' : undefined}
                            rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                          >
                            {link.label} →
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {c.skills.length > 0 && !myRole ? (
                    <div className="case-tags">
                      {c.skills.map((s) => (
                        <span key={s} className="tag">
                          {s}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </article>
              {isBubble ? (
                <div className="case-bubble-pebble" aria-hidden="true">
                  <Pebble size="sm" face={2} />
                </div>
              ) : null}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
