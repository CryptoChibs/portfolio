import './Penpen.css'

/** Round pastel-blue plush penguin  -  hero buddy */
export function Penpen({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`penpen-svg ${className}`.trim()}
      viewBox="0 0 200 220"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <ellipse cx="100" cy="208" rx="52" ry="8" fill="rgba(90, 80, 70, 0.18)" />

      {/* body */}
      <ellipse cx="100" cy="120" rx="72" ry="78" fill="#9ec5e0" />
      {/* belly */}
      <ellipse cx="100" cy="132" rx="48" ry="58" fill="#f7fafc" />

      {/* face oval */}
      <ellipse cx="100" cy="88" rx="46" ry="42" fill="#f7fafc" />

      {/* happy closed eyes */}
      <path
        d="M72 86 Q82 76 92 86"
        stroke="#2a3038"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M108 86 Q118 76 128 86"
        stroke="#2a3038"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />

      {/* cheeks */}
      <ellipse cx="68" cy="98" rx="8" ry="5" fill="#f5b8b0" opacity="0.55" />
      <ellipse cx="132" cy="98" rx="8" ry="5" fill="#f5b8b0" opacity="0.55" />

      {/* beak */}
      <ellipse cx="100" cy="104" rx="16" ry="7" fill="#f0c43a" />
      <ellipse cx="100" cy="102.5" rx="12" ry="3.5" fill="#f7d56a" opacity="0.7" />

      {/* wings */}
      <g className="penpen-wing penpen-wing-l">
        <ellipse cx="36" cy="128" rx="22" ry="36" fill="#8eb8d4" transform="rotate(-18 36 128)" />
      </g>
      <g className="penpen-wing penpen-wing-r">
        <ellipse cx="164" cy="128" rx="22" ry="36" fill="#8eb8d4" transform="rotate(18 164 128)" />
      </g>

      {/* feet */}
      <ellipse cx="78" cy="190" rx="18" ry="10" fill="#f0c43a" />
      <ellipse cx="122" cy="190" rx="18" ry="10" fill="#f0c43a" />
      <path d="M66 190 H90 M70 194 H86" stroke="#e0b030" strokeWidth="1.5" opacity="0.5" />
      <path d="M110 190 H134 M114 194 H130" stroke="#e0b030" strokeWidth="1.5" opacity="0.5" />
    </svg>
  )
}
