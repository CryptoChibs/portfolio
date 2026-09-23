import { Bubbles, SeaweedDecor, WaveBand } from './components/Atmosphere'
import { CaseStudies } from './components/CaseStudies'
import { Contact } from './components/Contact'
import { Creative } from './components/Creative'
import { Experience } from './components/Experience'
import { FeaturedWork } from './components/FeaturedWork'
import { Hero } from './components/Hero'
import { HowIWork } from './components/HowIWork'
import { ManyTabs } from './components/ManyTabs'
import { Nav } from './components/Nav'
import { Recommendations } from './components/Recommendations'
import { ScrollFade } from './components/ScrollFade'
import { SealGuide } from './components/SealGuide'
import { Skills } from './components/Skills'
import { Speaking } from './components/Speaking'
import { Summary } from './components/Summary'
import { Vision } from './components/Vision'
import { WhatIDo } from './components/WhatIDo'
import './App.css'

/**
 * Soft depth ladder — tight steps for a gradual dive.
 * Solids (not fade-into-next) so wave silhouettes stay visible.
 */
const D = {
  what: '#d2e6f2',
  summary: '#c5dceb',
  projects: '#b4d2e0',
  experience: '#9cbdd0',
  speaking: '#8db2c6',
  creative: '#7aa6bc',
  skills: '#6b9bb2',
  vision: '#5e90a8',
  recommendations: '#578aa4',
  contact: '#4f819a',
} as const

function App() {
  return (
    <>
      <ScrollFade />
      <div className="edge-fade edge-fade-bottom" aria-hidden="true" />
      <Nav />
      <main>
        <div className="depth-strip depth-ink depth-hero">
          <div data-scroll-fade>
            <Hero />
          </div>
          <WaveBand fill={D.what} />
        </div>

        <div className="depth-strip depth-ink" style={{ background: D.what }}>
          <div className="zone-inner">
            <Bubbles density="dense" />
            <SeaweedDecor side="left" />
            <div data-scroll-fade>
              <WhatIDo />
            </div>
            <div data-scroll-fade>
              <ManyTabs />
            </div>
          </div>
          <WaveBand fill={D.summary} />
        </div>

        <div className="depth-strip depth-ink" style={{ background: D.summary }}>
          <div className="zone-inner">
            <Bubbles density="dense" />
            <div data-scroll-fade>
              <Summary />
            </div>
            <div data-scroll-fade>
              <HowIWork />
            </div>
          </div>
          <WaveBand fill={D.projects} />
        </div>

        <div className="depth-strip depth-ink" style={{ background: D.projects }}>
          <div className="zone-inner">
            <Bubbles density="dense" />
            <SeaweedDecor side="right" />
            <div data-scroll-fade>
              <FeaturedWork />
            </div>
            <div data-scroll-fade>
              <CaseStudies />
            </div>
          </div>
          <WaveBand fill={D.experience} />
        </div>

        <div className="depth-strip depth-ink" style={{ background: D.experience }}>
          <div className="zone-inner">
            <Bubbles density="high" />
            <div data-scroll-fade>
              <Experience />
            </div>
          </div>
          <WaveBand fill={D.speaking} />
        </div>

        <div className="depth-strip depth-ink" style={{ background: D.speaking }}>
          <div className="zone-inner">
            <Bubbles density="high" />
            <div data-scroll-fade>
              <Speaking />
            </div>
          </div>
          <WaveBand fill={D.creative} />
        </div>

        <div className="depth-strip depth-foam" style={{ background: D.creative }}>
          <div className="zone-inner">
            <Bubbles density="high" />
            <div data-scroll-fade>
              <Creative />
            </div>
          </div>
          <WaveBand fill={D.skills} />
        </div>

        <div className="depth-strip depth-foam" style={{ background: D.skills }}>
          <div className="zone-inner">
            <Bubbles density="high" />
            <div data-scroll-fade>
              <Skills />
            </div>
          </div>
          <WaveBand fill={D.vision} />
        </div>

        <div className="depth-strip depth-foam" style={{ background: D.vision }}>
          <div className="zone-inner">
            <Bubbles density="high" />
            <div data-scroll-fade>
              <Vision />
            </div>
          </div>
          <WaveBand fill={D.recommendations} />
        </div>

        <div className="depth-strip depth-foam" style={{ background: D.recommendations }}>
          <div className="zone-inner">
            <Bubbles density="normal" />
            <div data-scroll-fade>
              <Recommendations />
            </div>
          </div>
          <WaveBand fill={D.contact} />
        </div>

        <div className="depth-strip depth-foam" style={{ background: D.contact }}>
          <div className="zone-inner">
            <Bubbles density="normal" />
            <div data-scroll-fade>
              <Contact />
            </div>
          </div>
        </div>
      </main>
      <footer className="site-footer">
        <p>
          Angela Garrido (Chibi) · Professional Portfolio · © {new Date().getFullYear()}
        </p>
      </footer>
      <SealGuide />
    </>
  )
}

export default App
