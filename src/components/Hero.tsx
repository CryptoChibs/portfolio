import { motion } from 'framer-motion'
import { site } from '../content/site'
import { Pebble } from './Pebble'
import './Hero.css'

export function Hero() {
  return (
    <section id="home" className="hero section" aria-labelledby="hero-name">
      <div className="hero-top">
        <div className="hero-copy">
          <motion.p
            className="hero-intro"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
          >
            {site.intro}
          </motion.p>
          <motion.h1
            id="hero-name"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            {site.fullName}
          </motion.h1>
          <motion.p
            className="hero-role"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.14 }}
          >
            {site.role}
          </motion.p>
          <motion.p
            className="hero-tagline"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
          >
            {site.tagline}
          </motion.p>
          <motion.div
            className="hero-ctas"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.24 }}
          >
            <a className="btn btn-primary" href="#cases">
              Project highlights
            </a>
            <a className="btn btn-accent" href="#contact">
              Let&apos;s talk
            </a>
          </motion.div>
        </div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.12 }}
        >
          <img
            className="hero-photo"
            src="/People/Angela.jpg"
            alt="Angela Garrido (Chibi)"
          />
          <div className="hero-pebble">
            <Pebble size="sm" face={1} interactive />
          </div>
        </motion.div>
      </div>

      <motion.div
        id="metrics"
        className="hero-metrics-wrap"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="sr-only">Career highlights</h2>
        <ul className="hero-metrics">
          {site.metrics.map((m) => (
            <li key={m.label} className="hero-metric card">
              <div className="metric">{m.value}</div>
              <div className="metric-label">{m.label}</div>
            </li>
          ))}
        </ul>
      </motion.div>

      <p className="hero-guide-hint">Foquito is your guide ↓</p>
    </section>
  )
}
