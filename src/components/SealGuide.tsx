import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { site, type SectionId } from '../content/site'
import './SealGuide.css'

const SECTIONS: SectionId[] = [
  'home',
  'what',
  'tabs',
  'summary',
  'process',
  'featured',
  'cases',
  'experience',
  'speaking',
  'creative',
  'skills',
  'vision',
  'recommendations',
  'contact',
]

export type FoquitoMood = 'calm' | 'happy' | 'wink' | 'surprised' | 'sparkle'

const MOODS: FoquitoMood[] = ['calm', 'happy', 'wink', 'surprised', 'sparkle']
const BUBBLE_MS = 5000
const NARROW = '(max-width: 640px)'
const SWIPE_TIP = 'Swipe the card, or tap the arrows.'

function FurDots() {
  // soft sherpa speckles like the plush texture
  const dots = [
    [48, 96], [58, 88], [70, 92], [92, 90], [104, 98], [112, 108],
    [52, 118], [66, 126], [88, 124], [100, 114], [74, 108], [60, 104],
    [96, 132], [54, 136], [82, 138], [44, 108], [118, 120],
  ] as const
  return (
    <g opacity="0.22" aria-hidden="true">
      {dots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.8 : 1.2} fill="#4a5560" />
      ))}
    </g>
  )
}

function Face({ mood }: { mood: FoquitoMood }) {
  const leftEye =
    mood === 'happy' || mood === 'sparkle' ? (
      <path d="M56 54 Q64 48 72 54" stroke="#1a1a1a" strokeWidth="3.2" fill="none" strokeLinecap="round" />
    ) : mood === 'wink' ? (
      <path d="M56 56 Q64 52 72 56" stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round" />
    ) : mood === 'surprised' ? (
      <circle cx="64" cy="54" r="7" fill="#1a1a1a" />
    ) : (
      <circle cx="64" cy="54" r="5.5" fill="#1a1a1a" />
    )

  const rightEye =
    mood === 'happy' || mood === 'sparkle' ? (
      <path d="M88 54 Q96 48 104 54" stroke="#1a1a1a" strokeWidth="3.2" fill="none" strokeLinecap="round" />
    ) : mood === 'surprised' ? (
      <circle cx="96" cy="54" r="7" fill="#1a1a1a" />
    ) : (
      <circle cx="96" cy="54" r="5.5" fill="#1a1a1a" />
    )

  const eyeShine =
    mood === 'calm' || mood === 'wink' || mood === 'surprised' ? (
      <g>
        {(mood !== 'wink') && <circle cx="62.2" cy="51.8" r={mood === 'surprised' ? 2.2 : 1.6} fill="#fff" />}
        <circle cx="94.2" cy="51.8" r={mood === 'surprised' ? 2.2 : 1.6} fill="#fff" />
      </g>
    ) : null

  // :3 cat mouth (not a :) smile)
  const mouth =
    mood === 'surprised' ? (
      <ellipse cx="80" cy="80" rx="5" ry="6" fill="#2a2a2a" />
    ) : (
      <path
        d={
          mood === 'happy' || mood === 'sparkle'
            ? 'M70 78 Q75 86 80 78 Q85 86 90 78'
            : mood === 'wink'
              ? 'M71 79 Q75.5 85 80 79 Q84.5 85 89 79'
              : 'M72 80 Q76 85 80 80 Q84 85 88 80'
        }
        stroke="#2a2a2a"
        strokeWidth="2.3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    )

  return (
    <g className="foquito-face">
      {/* darker velvet muzzle */}
      <ellipse cx="80" cy="68" rx="22" ry="16" fill="#6b7278" />
      <ellipse cx="80" cy="70" rx="16" ry="11" fill="#7a8188" />

      {leftEye}
      {rightEye}
      {eyeShine}

      {/* nose */}
      <ellipse cx="80" cy="70" rx="5" ry="4" fill="#1a1a1a" />
      <circle cx="78.5" cy="68.5" r="1.1" fill="#555" opacity="0.6" />

      {mouth}

      {mood === 'sparkle' && (
        <g className="foquito-hearts" fill="#ff8a9a">
          <path d="M48 42 c0-3 4-5 6-2 c2-3 6-1 6 2 c0 4-6 8-6 8 s-6-4-6-8z" />
          <path d="M108 40 c0-2.5 3.5-4 5-1.5 c1.5-2.5 5-1 5 1.5 c0 3.5-5 7-5 7 s-5-3.5-5-7z" />
        </g>
      )}

      {mood === 'surprised' && (
        <g fill="#7ec8e3" opacity="0.85">
          <circle cx="46" cy="48" r="3" />
          <circle cx="116" cy="52" r="2.5" />
        </g>
      )}
    </g>
  )
}

function FoquitoSvg({ mood }: { mood: FoquitoMood }) {
  return (
    <svg
      className="seal-svg"
      viewBox="0 0 160 175"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <ellipse cx="80" cy="164" rx="40" ry="6" fill="rgba(15,95,110,0.16)" />

      {/* body  -  grey plush */}
      <ellipse cx="80" cy="112" rx="46" ry="46" fill="#9aa1a8" />
      <ellipse cx="80" cy="118" rx="32" ry="34" fill="#b0b6bc" />
      <FurDots />

      {/* head */}
      <ellipse cx="80" cy="58" rx="40" ry="36" fill="#a3a9b0" />
      <ellipse cx="68" cy="52" rx="14" ry="10" fill="#b8bec4" opacity="0.55" />

      {/* cheeks soft */}
      <ellipse cx="52" cy="66" rx="7" ry="5" fill="#c4a8a8" opacity="0.35" />
      <ellipse cx="108" cy="66" rx="7" ry="5" fill="#c4a8a8" opacity="0.35" />

      <Face mood={mood} />

      {/* flippers */}
      <g className="seal-flipper seal-flipper-l">
        <ellipse cx="34" cy="118" rx="18" ry="11" fill="#8e959c" transform="rotate(-28 34 118)" />
        <ellipse cx="30" cy="116" rx="8" ry="5" fill="#a3a9b0" transform="rotate(-28 30 116)" opacity="0.5" />
      </g>
      <g className="seal-flipper seal-flipper-r">
        <ellipse cx="126" cy="118" rx="18" ry="11" fill="#8e959c" transform="rotate(28 126 118)" />
        <ellipse cx="130" cy="116" rx="8" ry="5" fill="#a3a9b0" transform="rotate(28 130 116)" opacity="0.5" />
      </g>

      {/* tail */}
      <path
        d="M64 148 Q80 168 96 148 Q88 158 80 160 Q72 158 64 148"
        fill="#8e959c"
      />

      {/* white sailor hat + blue stripe band + ribbons */}
      <g className="seal-hat">
        <ellipse cx="80" cy="28" rx="38" ry="9" fill="#f5f5f2" />
        <path
          d="M48 28 Q48 8 80 6 Q112 8 112 28"
          fill="#fafaf7"
        />
        <ellipse cx="80" cy="10" rx="26" ry="7" fill="#ffffff" />
        {/* stripe band */}
        <rect x="48" y="24" width="64" height="10" rx="3" fill="#7ec8e3" />
        <rect x="48" y="26" width="64" height="2.5" fill="#fff" opacity="0.9" />
        <rect x="48" y="30.5" width="64" height="2.5" fill="#fff" opacity="0.9" />
        {/* dangling ribbons */}
        <g className="foquito-ribbons">
          <path d="M108 30 Q118 48 114 68" stroke="#7ec8e3" strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M108 30 Q118 48 114 68" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="3 3" />
          <path d="M112 30 Q124 50 122 72" stroke="#7ec8e3" strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M112 30 Q124 50 122 72" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="3 3" />
        </g>
      </g>
    </svg>
  )
}

export function SealGuide() {
  const reduceMotion = useReducedMotion()
  const [section, setSection] = useState<SectionId>('home')
  const [tipIndex, setTipIndex] = useState(0)
  const [showBubble, setShowBubble] = useState(true)
  const [mood, setMood] = useState<FoquitoMood>('calm')
  const [narrow, setNarrow] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(NARROW).matches,
  )

  useEffect(() => {
    const ratios = new Map<SectionId, number>()
    let active: SectionId = 'home'

    const apply = (next: SectionId) => {
      if (next === active) return
      active = next
      setSection(next)
      setTipIndex(0)
      setShowBubble(true)
      setMood('calm')
    }

    const deepestOnScreen = () => {
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i])
        if (!el) continue
        const rect = el.getBoundingClientRect()
        if (rect.bottom > 0 && rect.top < window.innerHeight) return SECTIONS[i]
      }
      return null
    }

    const pickActive = () => {
      const atBottom =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4
      if (atBottom) {
        const next = deepestOnScreen()
        if (next) {
          apply(next)
          return
        }
      }

      let best: SectionId | null = null
      let bestRatio = 0
      for (const id of SECTIONS) {
        const ratio = ratios.get(id) ?? 0
        if (ratio > bestRatio) {
          bestRatio = ratio
          best = id
        }
      }
      if (!best || bestRatio <= 0) return
      apply(best)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id as SectionId
          ratios.set(id, entry.isIntersecting ? entry.intersectionRatio : 0)
        }
        pickActive()
      },
      {
        threshold: [0, 0.1, 0.2, 0.35, 0.5, 0.65, 0.8],
        rootMargin: '-15% 0px -40% 0px',
      },
    )

    SECTIONS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    const onScroll = () => pickActive()
    window.addEventListener('scroll', onScroll, { passive: true })
    pickActive()

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    if (!showBubble) return
    const id = window.setTimeout(() => setShowBubble(false), BUBBLE_MS)
    return () => window.clearTimeout(id)
  }, [showBubble, section, tipIndex])

  useEffect(() => {
    const mq = window.matchMedia(NARROW)
    const onChange = () => setNarrow(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const tips = useMemo(() => {
    const base = site.sealTips[section]
    if (narrow && section === 'recommendations') return [SWIPE_TIP, ...base]
    return base
  }, [narrow, section])
  const tip = tips[tipIndex % tips.length]

  const onSealClick = useCallback(() => {
    setMood((m) => {
      const i = MOODS.indexOf(m)
      return MOODS[(i + 1) % MOODS.length]
    })

    if (!showBubble) {
      setShowBubble(true)
      return
    }
    const next = tipIndex + 1
    if (next >= tips.length) {
      setShowBubble(false)
      setTipIndex(0)
    } else {
      setTipIndex(next)
    }
  }, [showBubble, tipIndex, tips.length])

  return (
    <div className="seal-guide">
      <AnimatePresence mode="wait">
        {showBubble && (
          <motion.div
            key={`${section}-${tipIndex}`}
            className="seal-bubble"
            role="status"
            initial={reduceMotion ? false : { opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.25 }}
          >
            <p>{tip}</p>
            <span className="seal-bubble-hint">tap Foquito for more</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        className={`seal-btn${reduceMotion ? '' : ' seal-bob'}`}
        onClick={onSealClick}
        aria-label={`Foquito the seal guide, feeling ${mood}. Click for tips.`}
        whileTap={reduceMotion ? undefined : { scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={mood}
            className="foquito-mood-wrap"
            initial={reduceMotion ? false : { scale: 0.92, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.18 }}
          >
            <FoquitoSvg mood={mood} />
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
