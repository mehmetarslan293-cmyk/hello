"use client";

/** İnce çizgi / izometrik tarzda koyu tema illüstrasyonlar — kart gövdesinde kullanım için */

export function IllBuyboxPool({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="bp-g" x1="40" y1="40" x2="360" y2="220">
          <stop stopColor="#a855f7" stopOpacity="0.35" />
          <stop offset="1" stopColor="#6366f1" stopOpacity="0.08" />
        </linearGradient>
      </defs>
      <rect width="400" height="260" fill="url(#bp-g)" opacity="0.45" />
      {/* Podium */}
      <path
        d="M80 180 L140 150 L200 170 L260 140 L320 165 L320 210 L80 210 Z"
        fill="#18181b"
        stroke="#71717a"
        strokeWidth="1.2"
      />
      <path d="M140 150 L200 130 L260 140 L200 155 Z" fill="#27272a" stroke="#52525b" />
      {/* Bars */}
      <rect x="95" y="130" width="28" height="50" rx="3" fill="#8b5cf6" opacity="0.85" />
      <rect x="135" y="110" width="28" height="70" rx="3" fill="#a78bfa" opacity="0.95" />
      <rect x="175" y="95" width="28" height="85" rx="3" fill="#c4b5fd" />
      <rect x="215" y="115" width="28" height="65" rx="3" fill="#7c3aed" opacity="0.85" />
      <rect x="255" y="125" width="28" height="55" rx="3" fill="#6366f1" opacity="0.75" />
      {/* Medals */}
      <circle cx="149" cy="88" r="10" fill="#fbbf24" opacity="0.9" />
      <text x="149" y="92" textAnchor="middle" fill="#1c1917" fontSize="10" fontWeight="700">
        1
      </text>
      {/* Floating chips */}
      <rect x="290" y="55" width="72" height="28" rx="8" fill="#27272a" stroke="#52525b" />
      <path d="M305 68 h34 M305 74 h22" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IllRealtimeTracking({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="rt-g" x1="60" y1="30" x2="340" y2="230">
          <stop stopColor="#34d399" stopOpacity="0.35" />
          <stop offset="1" stopColor="#06b6d4" stopOpacity="0.12" />
        </linearGradient>
      </defs>
      <rect width="400" height="260" fill="url(#rt-g)" opacity="0.5" />
      {/* Tablet */}
      <path
        d="M140 175 L260 165 L275 195 L155 205 Z"
        fill="#0f172a"
        stroke="#334155"
        strokeWidth="1.2"
      />
      <path d="M155 168 L255 160 L268 185 L168 193 Z" fill="#1e293b" stroke="#475569" />
      <circle cx="210" cy="177" r="14" fill="#38bdf8" opacity="0.35" />
      <path
        d="M204 177 L209 182 L218 171"
        stroke="#22d3ee"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Figür sol */}
      <ellipse cx="115" cy="155" rx="22" ry="22" fill="#f472b6" opacity="0.85" />
      <path d="M115 178 L108 210 L122 210 Z" fill="#ec4899" opacity="0.75" />
      {/* Figür sağ */}
      <ellipse cx="305" cy="148" rx="20" ry="20" fill="#38bdf8" opacity="0.85" />
      <path d="M305 170 L298 205 L312 205 Z" fill="#0ea5e9" opacity="0.75" />
      {/* Floating UI */}
      <rect x="65" y="58" width="52" height="38" rx="10" fill="#0f172a" stroke="#22d3ee" opacity="0.85" />
      <path d="M76 78 h28 M76 84 h18" stroke="#67e8f9" strokeWidth="2" strokeLinecap="round" />
      <rect x="295" y="72" width="46" height="46" rx="12" fill="#064e3b" stroke="#34d399" opacity="0.9" />
      <path d="M312 98 L322 108 L336 90" stroke="#6ee7b7" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="340" cy="135" r="6" fill="#f472b6" opacity="0.8" />
    </svg>
  );
}

export function IllSecurePayment({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="sp-g" x1="50" y1="40" x2="350" y2="220">
          <stop stopColor="#6366f1" stopOpacity="0.35" />
          <stop offset="1" stopColor="#312e81" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <rect width="400" height="260" fill="url(#sp-g)" opacity="0.45" />
      {/* Kartlar */}
      <path
        d="M95 165 L265 145 L285 185 L115 205 Z"
        fill="#18181b"
        stroke="#52525b"
        strokeWidth="1"
      />
      <path
        d="M110 130 L270 115 L285 155 L125 172 Z"
        fill="#27272a"
        stroke="#6366f1"
        strokeWidth="1.2"
        opacity="0.95"
      />
      <path
        d="M125 98 L275 85 L288 125 L138 142 Z"
        fill="#3f3f46"
        stroke="#818cf8"
        strokeWidth="1.2"
      />
      <rect x="155" y="108" width="70" height="10" rx="2" fill="#6366f1" opacity="0.6" />
      {/* Kalkan */}
      <path
        d="M200 45 L235 58 L235 95 Q200 118 165 95 L165 58 Z"
        fill="#312e81"
        stroke="#a5b4fc"
        strokeWidth="2"
      />
      <path d="M200 62 L210 78 L190 78 Z" fill="#c7d2fe" />
      {/* Kilit */}
      <rect x="188" y="115" width="24" height="22" rx="4" fill="#18181b" stroke="#94a3b8" />
      <path d="M192 115 V105 Q200 96 208 105 V115" stroke="#94a3b8" strokeWidth="2" />
    </svg>
  );
}

export function IllDashboard({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="db-g" x1="30" y1="50" x2="370" y2="210">
          <stop stopColor="#c026d3" stopOpacity="0.28" />
          <stop offset="1" stopColor="#4f46e5" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <rect width="400" height="260" fill="url(#db-g)" opacity="0.5" />
      {/* Monitör */}
      <rect
        x="95"
        y="72"
        width="210"
        height="130"
        rx="14"
        fill="#0f172a"
        stroke="#475569"
        strokeWidth="2"
      />
      <rect x="105" y="82" width="190" height="96" rx="6" fill="#020617" />
      {/* Grafik */}
      <path
        d="M120 150 L150 130 L180 140 L210 110 L240 125 L270 95 L290 105"
        stroke="#a78bfa"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="290" cy="105" r="5" fill="#22d3ee" />
      {/* Pasta */}
      <path
        d="M200 155 L200 175 A20 20 0 0 1 175 175 Z"
        fill="#8b5cf6"
        opacity="0.85"
      />
      <path d="M200 155 L220 175 A20 20 0 0 1 200 175 Z" fill="#6366f1" opacity="0.65" />
      {/* Ayak */}
      <path d="M175 202 H225 V218 H175 Z" fill="#334155" />
      <rect x="165" y="218" width="70" height="8" rx="3" fill="#1e293b" />
      {/* Widget */}
      <rect x="315" y="95" width="62" height="44" rx="10" fill="#18181b" stroke="#a855f7" opacity="0.85" />
      <path d="M325 118 h38 M325 124 h24" stroke="#e879f9" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
