import './Lily.css'

/** White seal  -  chaos gremlin. Sparse easter egg only. */
export function Lily({ className = '' }: { className?: string }) {
  return (
    <div className={`lily ${className}`.trim()} title="Lily was here">
      <svg viewBox="0 0 80 70" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <ellipse cx="40" cy="42" rx="26" ry="22" fill="#f5f5f5" />
        <ellipse cx="40" cy="28" rx="20" ry="18" fill="#fafafa" />
        <ellipse cx="40" cy="34" rx="12" ry="9" fill="#e8e8e8" />
        <circle cx="33" cy="26" r="3.2" fill="#2c3d52" />
        <circle cx="47" cy="26" r="3.2" fill="#2c3d52" />
        <circle cx="32" cy="25" r="1" fill="#fff" />
        <circle cx="46" cy="25" r="1" fill="#fff" />
        <ellipse cx="40" cy="33" rx="3" ry="2.4" fill="#2c3d52" />
        <path
          d="M34 38 Q37 42 40 38 Q43 42 46 38"
          stroke="#2c3d52"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
        />
        <ellipse cx="18" cy="44" rx="8" ry="5" fill="#eeeeee" transform="rotate(-20 18 44)" />
        <ellipse cx="62" cy="44" rx="8" ry="5" fill="#eeeeee" transform="rotate(20 62 44)" />
      </svg>
    </div>
  )
}
