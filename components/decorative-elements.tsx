import React from 'react'

interface DecorativeElementProps {
  size: number
  opacity: number
  className?: string
}

// 1. Bandeira Pride 3D
export const PrideFlag3D: React.FC<DecorativeElementProps> = ({ size, opacity, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ opacity }}
  >
    <defs>
      <linearGradient id="flag-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E40303" />
        <stop offset="16.67%" stopColor="#FF8C00" />
        <stop offset="33.33%" stopColor="#FFED00" />
        <stop offset="50%" stopColor="#008026" />
        <stop offset="66.67%" stopColor="#24408E" />
        <stop offset="83.33%" stopColor="#732982" />
        <stop offset="100%" stopColor="#E40303" />
      </linearGradient>
      <filter id="shadow">
        <feDropShadow dx="4" dy="4" stdDeviation="6" floodOpacity="0.3" />
      </filter>
    </defs>
    {/* Bandeira ondulando */}
    <path
      d="M 20 40 Q 60 30 100 40 T 180 40 L 180 60 Q 140 70 100 60 T 20 60 Z"
      fill="#E40303"
      filter="url(#shadow)"
    />
    <path
      d="M 20 60 Q 60 50 100 60 T 180 60 L 180 80 Q 140 90 100 80 T 20 80 Z"
      fill="#FF8C00"
      filter="url(#shadow)"
    />
    <path
      d="M 20 80 Q 60 70 100 80 T 180 80 L 180 100 Q 140 110 100 100 T 20 100 Z"
      fill="#FFED00"
      filter="url(#shadow)"
    />
    <path
      d="M 20 100 Q 60 90 100 100 T 180 100 L 180 120 Q 140 130 100 120 T 20 120 Z"
      fill="#008026"
      filter="url(#shadow)"
    />
    <path
      d="M 20 120 Q 60 110 100 120 T 180 120 L 180 140 Q 140 150 100 140 T 20 140 Z"
      fill="#24408E"
      filter="url(#shadow)"
    />
    <path
      d="M 20 140 Q 60 130 100 140 T 180 140 L 180 160 Q 140 170 100 160 T 20 160 Z"
      fill="#732982"
      filter="url(#shadow)"
    />
  </svg>
)

// 2. Punho Erguido
export const RaisedFist: React.FC<DecorativeElementProps> = ({ size, opacity, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ opacity }}
  >
    <defs>
      <linearGradient id="fist-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E40303" />
        <stop offset="20%" stopColor="#FF8C00" />
        <stop offset="40%" stopColor="#FFED00" />
        <stop offset="60%" stopColor="#008026" />
        <stop offset="80%" stopColor="#24408E" />
        <stop offset="100%" stopColor="#732982" />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    {/* Punho */}
    <path
      d="M 80 140 L 80 100 Q 80 85 90 80 L 90 70 Q 90 60 100 60 Q 110 60 110 70 L 110 65 Q 110 55 120 55 Q 130 55 130 65 L 130 70 Q 130 60 140 60 Q 150 60 150 70 L 150 90 Q 150 85 155 85 Q 165 85 165 95 L 165 120 Q 165 140 150 150 L 90 150 Q 80 150 80 140 Z"
      fill="url(#fist-gradient)"
      filter="url(#glow)"
    />
    {/* Braço */}
    <rect x="70" y="140" width="70" height="40" rx="5" fill="url(#fist-gradient)" opacity="0.8" />
  </svg>
)

// 3. Coração Geométrico
export const GeometricHeart: React.FC<DecorativeElementProps> = ({ size, opacity, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ opacity }}
  >
    <defs>
      <linearGradient id="heart-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E40303" />
        <stop offset="25%" stopColor="#FF8C00" />
        <stop offset="50%" stopColor="#FFED00" />
        <stop offset="75%" stopColor="#008026" />
        <stop offset="100%" stopColor="#732982" />
      </linearGradient>
    </defs>
    {/* Coração angular moderno */}
    <path
      d="M 100 160 L 60 120 L 60 85 Q 60 60 80 60 Q 90 60 100 70 Q 110 60 120 60 Q 140 60 140 85 L 140 120 Z"
      fill="url(#heart-gradient)"
      stroke="#fff"
      strokeWidth="3"
    />
  </svg>
)

// 4. Listras Pride Abstratas
export const PrideStripes: React.FC<DecorativeElementProps> = ({ size, opacity, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ opacity }}
  >
    <g transform="rotate(-45 100 100)">
      <rect x="50" y="20" width="100" height="15" fill="#E40303" rx="2" />
      <rect x="50" y="40" width="100" height="15" fill="#FF8C00" rx="2" />
      <rect x="50" y="60" width="100" height="15" fill="#FFED00" rx="2" />
      <rect x="50" y="80" width="100" height="15" fill="#008026" rx="2" />
      <rect x="50" y="100" width="100" height="15" fill="#24408E" rx="2" />
      <rect x="50" y="120" width="100" height="15" fill="#732982" rx="2" />
    </g>
  </svg>
)

// 5. Círculos Concêntricos
export const ConcentricCircles: React.FC<DecorativeElementProps> = ({ size, opacity, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ opacity }}
  >
    <circle cx="100" cy="100" r="80" fill="none" stroke="#E40303" strokeWidth="8" />
    <circle cx="100" cy="100" r="65" fill="none" stroke="#FF8C00" strokeWidth="8" />
    <circle cx="100" cy="100" r="50" fill="none" stroke="#FFED00" strokeWidth="8" />
    <circle cx="100" cy="100" r="35" fill="none" stroke="#008026" strokeWidth="8" />
    <circle cx="100" cy="100" r="20" fill="none" stroke="#24408E" strokeWidth="8" />
    <circle cx="100" cy="100" r="8" fill="#732982" />
  </svg>
)

// 6. Blob Orgânico
export const OrganicBlob: React.FC<DecorativeElementProps> = ({ size, opacity, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ opacity }}
  >
    <defs>
      <linearGradient id="blob-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E40303" stopOpacity="0.8" />
        <stop offset="33%" stopColor="#FFED00" stopOpacity="0.8" />
        <stop offset="66%" stopColor="#008026" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#732982" stopOpacity="0.8" />
      </linearGradient>
      <filter id="blob-blur">
        <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
      </filter>
    </defs>
    <path
      d="M 100 20 Q 140 30 160 60 Q 180 90 170 120 Q 160 150 130 170 Q 100 185 70 170 Q 40 150 30 120 Q 20 90 40 60 Q 60 30 100 20 Z"
      fill="url(#blob-gradient)"
      filter="url(#blob-blur)"
    />
  </svg>
)

// 7. Triângulo Rosa Moderno
export const PinkTriangle: React.FC<DecorativeElementProps> = ({ size, opacity, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ opacity }}
  >
    <defs>
      <linearGradient id="triangle-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF1493" />
        <stop offset="50%" stopColor="#FF69B4" />
        <stop offset="100%" stopColor="#FFC0CB" />
      </linearGradient>
    </defs>
    <path
      d="M 100 40 L 160 150 L 40 150 Z"
      fill="url(#triangle-gradient)"
      stroke="#fff"
      strokeWidth="4"
    />
  </svg>
)

// 8. Respingo de Tinta
export const InkSplash: React.FC<DecorativeElementProps> = ({ size, opacity, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ opacity }}
  >
    <defs>
      <radialGradient id="splash-gradient">
        <stop offset="0%" stopColor="#FF8C00" />
        <stop offset="50%" stopColor="#FFED00" />
        <stop offset="100%" stopColor="#008026" />
      </radialGradient>
    </defs>
    {/* Respingo central */}
    <circle cx="100" cy="100" r="40" fill="url(#splash-gradient)" />
    {/* Gotas ao redor */}
    <circle cx="70" cy="70" r="15" fill="#E40303" opacity="0.8" />
    <circle cx="140" cy="75" r="18" fill="#FF8C00" opacity="0.8" />
    <circle cx="65" cy="130" r="12" fill="#FFED00" opacity="0.8" />
    <circle cx="135" cy="135" r="20" fill="#008026" opacity="0.8" />
    <circle cx="100" cy="50" r="10" fill="#24408E" opacity="0.8" />
    <circle cx="155" cy="110" r="14" fill="#732982" opacity="0.8" />
  </svg>
)

// Mapa de componentes
export const decorativeElementsMap = {
  'none': null,
  'pride-flag-3d': PrideFlag3D,
  'raised-fist': RaisedFist,
  'geometric-heart': GeometricHeart,
  'pride-stripes': PrideStripes,
  'concentric-circles': ConcentricCircles,
  'organic-blob': OrganicBlob,
  'pink-triangle': PinkTriangle,
  'ink-splash': InkSplash,
}

// Labels para o dropdown
export const decorativeElementsLabels = {
  'none': 'Nenhum',
  'pride-flag-3d': '🏳️‍🌈 Bandeira Pride 3D',
  'raised-fist': '✊ Punho Erguido',
  'geometric-heart': '❤️ Coração Geométrico',
  'pride-stripes': '🌈 Listras Pride',
  'concentric-circles': '⭕ Círculos Concêntricos',
  'organic-blob': '💧 Blob Orgânico',
  'pink-triangle': '🔺 Triângulo Rosa',
  'ink-splash': '💥 Respingo de Tinta',
}

