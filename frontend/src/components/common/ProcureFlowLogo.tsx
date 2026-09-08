import React from 'react';

interface ProcureFlowLogoProps {
  size?: number;
  showText?: boolean;
  animated?: boolean;
  className?: string;
  textColor?: string;
}

export const ProcureFlowLogo: React.FC<ProcureFlowLogoProps> = ({
  size = 120,
  showText = true,
  animated = false,
  className = '',
  textColor
}) => {
  const width = size;
  const height = showText ? size * 1.15 : size;

  return (
    <div
      className={`procureflow-logo-container ${animated ? 'logo-animated' : ''} ${className}`}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none'
      }}
    >
      <svg
        width={width}
        height={height}
        viewBox="0 0 400 460"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          overflow: 'visible',
          filter: animated ? 'drop-shadow(0 10px 25px rgba(16, 185, 129, 0.25))' : 'none'
        }}
      >
        <defs>
          {/* Main Container Green Gradient */}
          <linearGradient id="pfBagGradient" x1="200" y1="90" x2="200" y2="340" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#065f46" />
            <stop offset="35%" stopColor="#047857" />
            <stop offset="75%" stopColor="#059669" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>

          {/* Top Spout Tab Gradient */}
          <linearGradient id="pfTabGradient" x1="200" y1="80" x2="200" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#044e3b" />
            <stop offset="100%" stopColor="#065f46" />
          </linearGradient>

          {/* Golden Coffee / Grain Bean Gradient */}
          <linearGradient id="pfBeanGradient" x1="155" y1="180" x2="195" y2="280" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="50%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#854d0e" />
          </linearGradient>

          {/* Leaf Gradient */}
          <linearGradient id="pfLeafGradient" x1="220" y1="180" x2="250" y2="280" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#047857" />
            <stop offset="60%" stopColor="#064e3b" />
            <stop offset="100%" stopColor="#022c22" />
          </linearGradient>

          {/* Glow Filter for Animation */}
          <filter id="pfGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* --- Top Vertical Hanger Stem / String --- */}
        <line
          x1="200"
          y1="48"
          x2="200"
          y2="105"
          stroke="#1e293b"
          strokeWidth="6"
          strokeLinecap="round"
          className={animated ? 'pf-stem-anim' : ''}
        />

        {/* --- Main Procurement Silo / Bag Body --- */}
        <g className={animated ? 'pf-bag-group' : ''}>
          {/* Bag Background Shape */}
          <path
            d="M 170 95 L 230 95 L 260 135 L 260 325 L 140 325 L 140 135 Z"
            fill="url(#pfBagGradient)"
            stroke="#1e293b"
            strokeWidth="7"
            strokeLinejoin="round"
          />

          {/* Top Facet Fold Details */}
          <path
            d="M 140 135 L 260 135"
            stroke="#1e293b"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M 170 95 L 175 142 L 200 152 L 225 142 L 230 95"
            fill="url(#pfTabGradient)"
            stroke="#1e293b"
            strokeWidth="5"
            strokeLinejoin="round"
          />

          {/* Inner Light Reflection Sheen */}
          <path
            d="M 148 145 L 148 315"
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </g>

        {/* --- Center Emblem: Grain/Coffee Bean (Left) & Agriculture Leaf (Right) --- */}
        <g className={animated ? 'pf-core-seeds' : ''}>
          {/* Golden Grain / Coffee Bean (Left) */}
          <g transform="translate(-8, 0)">
            <ellipse
              cx="178"
              cy="236"
              rx="28"
              ry="42"
              transform="rotate(-18 178 236)"
              fill="url(#pfBeanGradient)"
              stroke="#1e293b"
              strokeWidth="6"
            />
            {/* Bean S-Curve / Crease */}
            <path
              d="M 174 200 C 185 220, 165 245, 178 272"
              stroke="#ffffff"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Bean Outline Accent */}
            <path
              d="M 158 215 C 152 235, 156 255, 168 268"
              stroke="rgba(255, 255, 255, 0.35)"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
          </g>

          {/* Green Agriculture Leaf (Right) */}
          <g transform="translate(14, 0)">
            <path
              d="M 215 198 C 248 206, 256 244, 235 275 C 218 252, 212 222, 215 198 Z"
              fill="url(#pfLeafGradient)"
              stroke="#1e293b"
              strokeWidth="6"
              strokeLinejoin="round"
            />
            {/* Leaf Central Vein */}
            <path
              d="M 216 200 Q 228 234 233 273"
              stroke="rgba(255, 255, 255, 0.7)"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        </g>

        {/* --- Bottom Base Flowing Waves ("ProcureFlow") --- */}
        <g className={animated ? 'pf-waves-anim' : ''}>
          <path
            d="M 105 338 C 125 318, 145 348, 170 330 C 195 312, 215 345, 240 330 C 265 315, 285 340, 305 334"
            stroke="#1e293b"
            strokeWidth="7.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 115 352 C 135 334, 155 358, 180 344 C 205 330, 225 356, 250 344 C 275 332, 290 350, 300 348"
            stroke="#059669"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            opacity="0.75"
          />
        </g>

        {/* --- Brand Wordmark Text: PROCUREFLOW --- */}
        {showText && (
          <g className={animated ? 'pf-text-group' : ''}>
            <text
              x="200"
              y="420"
              textAnchor="middle"
              fill={textColor || '#1e293b'}
              style={{
                fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
                fontSize: '44px',
                fontWeight: 900,
                letterSpacing: '5px',
                textTransform: 'uppercase'
              }}
            >
              PROCUREFLOW
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
