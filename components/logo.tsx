export function Logo() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      
      {/* Aperture blades - Lâminas da abertura */}
      <g transform="translate(100, 100)">
        {/* Blade 1 - Pink */}
        <path
          d="M 0,-60 L 35,-25 L 0,0 Z"
          fill="#ec4899"
          opacity="0.95"
        />
        {/* Blade 2 - Red/Orange */}
        <path
          d="M 35,-25 L 60,0 L 0,0 Z"
          fill="#f97316"
          opacity="0.95"
        />
        {/* Blade 3 - Yellow */}
        <path
          d="M 60,0 L 35,25 L 0,0 Z"
          fill="#fbbf24"
          opacity="0.95"
        />
        {/* Blade 4 - Light Green */}
        <path
          d="M 35,25 L 0,60 L 0,0 Z"
          fill="#84cc16"
          opacity="0.95"
        />
        {/* Blade 5 - Cyan */}
        <path
          d="M 0,60 L -35,25 L 0,0 Z"
          fill="#06b6d4"
          opacity="0.95"
        />
        {/* Blade 6 - Blue */}
        <path
          d="M -35,25 L -60,0 L 0,0 Z"
          fill="#3b82f6"
          opacity="0.95"
        />
        {/* Blade 7 - Purple */}
        <path
          d="M -60,0 L -35,-25 L 0,0 Z"
          fill="#a855f7"
          opacity="0.95"
        />
        {/* Blade 8 - Magenta */}
        <path
          d="M -35,-25 L 0,-60 L 0,0 Z"
          fill="#d946ef"
          opacity="0.95"
        />
      </g>
      
      {/* Center circle - Círculo central branco */}
      <circle cx="100" cy="100" r="20" fill="white" />
    </svg>
  )
}
