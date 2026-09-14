import React from 'react';

interface Vtv56LogoGraphicProps {
  className?: string;
}

export const Vtv56LogoGraphic: React.FC<Vtv56LogoGraphicProps> = ({ className = 'w-full max-w-[420px] h-auto' }) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 520 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-[0_4px_12px_rgba(0,0,0,0.25)]"
      >
        <defs>
          {/* Subtle gradient for radio wave signal */}
          <linearGradient id="vtvRedWave" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EE1C25" />
            <stop offset="100%" stopColor="#D2151D" />
          </linearGradient>
          {/* Drop shadow for 3D depth */}
          <filter id="whiteGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.2" />
          </filter>
        </defs>

        {/* ================= VTV LOGO ================= */}
        {/* Letter 'V' (Red) with thick white border */}
        <g filter="url(#whiteGlow)">
          <path
            d="M 42 35 L 78 35 L 108 128 L 138 35 L 174 35 L 126 155 L 90 155 Z"
            fill="#ED1C24"
            stroke="#FFFFFF"
            strokeWidth="9"
            strokeLinejoin="round"
          />
        </g>

        {/* Letter 'T' (Green) with thick white border */}
        <g filter="url(#whiteGlow)">
          <path
            d="M 126 35 L 206 35 L 206 63 L 178 63 L 178 155 L 148 155 L 148 63 L 126 63 Z"
            fill="#00A651"
            stroke="#FFFFFF"
            strokeWidth="9"
            strokeLinejoin="round"
          />
        </g>

        {/* Letter 'V' (Blue) with thick white border */}
        <g filter="url(#whiteGlow)">
          <path
            d="M 166 35 L 202 35 L 232 128 L 262 35 L 298 35 L 250 155 L 214 155 Z"
            fill="#0080FF"
            stroke="#FFFFFF"
            strokeWidth="9"
            strokeLinejoin="round"
          />
        </g>

        {/* ================= NUMBER 56 WITH CONCENTRIC SIGNAL WAVES ================= */}
        {/* The 56 signal rings emblem */}
        <g transform="translate(230, 20)">
          {/* Background white contour behind rings to make them pop */}
          <circle cx="100" cy="85" r="62" fill="#FFFFFF" opacity="0.95" />

          {/* Number 5 top bar & spine */}
          <path
            d="M 52 42 L 102 42 L 102 56 L 68 56 L 66 82 C 72 76 80 74 90 74 C 110 74 122 87 122 106 C 122 125 106 138 86 138 C 70 138 56 128 52 114"
            stroke="#ED1C24"
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Concentric antenna wave arcs for 5 & 6 */}
          {/* Ring 1 (outermost) */}
          <circle cx="102" cy="104" r="50" stroke="#ED1C24" strokeWidth="4.5" fill="none" strokeDasharray="300" strokeDashoffset="0" />
          {/* Ring 2 */}
          <circle cx="102" cy="104" r="41" stroke="#ED1C24" strokeWidth="4.5" fill="none" />
          {/* Ring 3 */}
          <circle cx="102" cy="104" r="32" stroke="#ED1C24" strokeWidth="4.5" fill="none" />
          {/* Ring 4 */}
          <circle cx="102" cy="104" r="23" stroke="#ED1C24" strokeWidth="4.5" fill="none" />
          {/* Ring 5 (innermost core) */}
          <circle cx="102" cy="104" r="14" stroke="#ED1C24" strokeWidth="4.5" fill="#ED1C24" />

          {/* White concentric wave separators overlay */}
          <circle cx="102" cy="104" r="45.5" stroke="#FFFFFF" strokeWidth="3" fill="none" />
          <circle cx="102" cy="104" r="36.5" stroke="#FFFFFF" strokeWidth="3" fill="none" />
          <circle cx="102" cy="104" r="27.5" stroke="#FFFFFF" strokeWidth="3" fill="none" />
          <circle cx="102" cy="104" r="18.5" stroke="#FFFFFF" strokeWidth="3" fill="none" />
        </g>

        {/* ================= WORD 'NĂM' ================= */}
        <text
          x="395"
          y="126"
          fill="#FFFFFF"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="48"
          letterSpacing="2"
          filter="url(#whiteGlow)"
        >
          NĂM
        </text>
      </svg>
    </div>
  );
};
