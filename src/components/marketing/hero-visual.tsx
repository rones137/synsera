/** Full-bleed atmospheric product silhouette — not a floating card */
export function HeroVisual() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 top-[42%] overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-app/40 to-bg-app" />
      <svg
        className="absolute left-1/2 top-0 h-full w-[140%] max-w-none -translate-x-1/2 opacity-[0.55] sm:w-[110%] sm:opacity-70"
        viewBox="0 0 1200 520"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="panel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1a22" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#121218" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#E33240" stopOpacity="0" />
            <stop offset="40%" stopColor="#E33240" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#E33240" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        {/* Horizon panel */}
        <rect x="80" y="40" width="1040" height="420" rx="20" fill="url(#panel)" stroke="#2c2c35" />
        <rect x="80" y="40" width="200" height="420" rx="20" fill="#14141a" stroke="#2c2c35" />
        {/* Sidebar marks */}
        <rect x="110" y="90" width="28" height="28" rx="8" fill="#E33240" opacity="0.9" />
        <rect x="150" y="96" width="90" height="10" rx="3" fill="#3a3a44" />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect
            key={i}
            x="110"
            y={150 + i * 44}
            width={i === 0 ? 140 : 120}
            height="12"
            rx="4"
            fill={i === 0 ? "#E33240" : "#2c2c35"}
            opacity={i === 0 ? 0.35 : 1}
          />
        ))}
        {/* Stat blocks */}
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect
              x={320 + i * 190}
              y="88"
              width="170"
              height="88"
              rx="12"
              fill="#16161d"
              stroke="#2c2c35"
            />
            <rect x={340 + i * 190} y="108" width="70" height="8" rx="2" fill="#3a3a44" />
            <rect
              x={340 + i * 190}
              y="132"
              width={90 + (i % 2) * 20}
              height="18"
              rx="3"
              fill={i === 0 ? "#E33240" : "#f4f4f5"}
              opacity={i === 0 ? 0.85 : 0.55}
            />
          </g>
        ))}
        {/* Table rows */}
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={`r-${i}`}>
            <rect x="320" y={210 + i * 42} width="740" height="32" rx="6" fill="#14141a" />
            <rect x="336" y={220 + i * 42} width="120" height="10" rx="2" fill="#3a3a44" />
            <rect x="780" y={220 + i * 42} width="80" height="10" rx="2" fill="#3a3a44" />
            <rect
              x="980"
              y={218 + i * 42}
              width={60 + i * 8}
              height="14"
              rx="3"
              fill="#E33240"
              opacity={0.25 + i * 0.08}
            />
          </g>
        ))}
        {/* Accent scan line */}
        <path d="M80 200 H1120" stroke="url(#line)" strokeWidth="1.5" />
      </svg>
    </div>
  );
}
