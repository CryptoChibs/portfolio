import type { CSSProperties } from 'react'

export function Bubbles({
  density = 'normal',
}: {
  density?: 'low' | 'normal' | 'high' | 'dense'
}) {
  const count = density === 'low' ? 8 : density === 'normal' ? 14 : density === 'high' ? 20 : 28
  const bubbles = Array.from({ length: count }, (_, i) => ({
    left: `${3 + ((i * 37) % 94)}%`,
    size: 5 + ((i * 7) % 14),
    delay: (i * 0.55) % 12,
    duration: 11 + (i % 7) * 2.2,
  }))

  return (
    <div className="bubbles" aria-hidden="true">
      {bubbles.map((b, i) => (
        <span
          key={i}
          className="bubble"
          style={{
            left: b.left,
            width: b.size,
            height: b.size,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`,
          }}
        />
      ))}
    </div>
  )
}

/**
 * Soft silhouette wave — fill must be the solid top color of the NEXT strip
 * so it reads as that section’s wavy leading edge.
 */
export function WaveBand({ fill }: { fill: string }) {
  return (
    <div className="wave-band" aria-hidden="true">
      <svg viewBox="0 0 1440 72" preserveAspectRatio="none">
        <path
          fill={fill}
          d="M0,40 C180,62 360,14 540,36 C720,58 900,18 1080,40 C1200,54 1320,48 1440,36 L1440,72 L0,72 Z"
        />
        <path
          fill={fill}
          d="M1440,40 C1620,62 1800,14 1980,36 C2160,58 2340,18 2520,40 C2640,54 2760,48 2880,36 L2880,72 L1440,72 Z"
        />
      </svg>
    </div>
  )
}

export function SeaweedDecor({ side = 'left' }: { side?: 'left' | 'right' }) {
  const style: CSSProperties =
    side === 'left'
      ? { left: '4%', height: 90 }
      : { right: '6%', left: 'auto', height: 110, animationDelay: '1.2s' }
  return <span className="seaweed" style={style} aria-hidden="true" />
}
