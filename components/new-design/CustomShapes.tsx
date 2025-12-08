'use client'

// Formas e ilustrações customizadas para o projeto

export function AbstractShape1() {
  return (
    <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
      <path
        d="M50 20 L150 20 L180 80 L150 140 L50 140 L20 80 Z"
        fill="currentColor"
        className="text-yellow-400"
      />
      <circle cx="100" cy="80" r="30" fill="currentColor" className="text-purple-600" />
    </svg>
  );
}

export function AbstractShape2() {
  return (
    <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
      <rect x="20" y="50" width="80" height="100" fill="currentColor" className="text-orange-500" transform="rotate(-15 60 100)" />
      <circle cx="140" cy="60" r="40" fill="currentColor" className="text-blue-600" />
      <path d="M30 150 Q100 120 170 150" stroke="currentColor" strokeWidth="8" className="text-pink-500" fill="none" />
    </svg>
  );
}

export function AbstractShape3() {
  return (
    <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
      <path
        d="M100 20 L180 100 L100 180 L20 100 Z"
        fill="currentColor"
        className="text-indigo-600"
      />
      <rect x="70" y="70" width="60" height="60" fill="currentColor" className="text-yellow-300" />
    </svg>
  );
}

export function HandIllustration() {
  return (
    <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
      <path
        d="M30 70 C30 70 35 40 40 35 C45 30 50 30 50 40 L50 60 L55 30 C55 25 60 25 62 30 L65 60 L68 35 C68 30 73 30 75 35 L77 60 L80 45 C80 40 85 40 87 45 L88 70 C88 85 75 90 65 90 C55 90 40 85 35 75 L30 70 Z"
        fill="currentColor"
        className="text-orange-500"
        stroke="currentColor"
        strokeWidth="2"
        style={{ color: 'black' }}
      />
    </svg>
  );
}

export function EyeIllustration() {
  return (
    <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
      <ellipse cx="50" cy="50" rx="40" ry="25" fill="currentColor" className="text-purple-600" />
      <circle cx="50" cy="50" r="15" fill="currentColor" style={{ color: 'black' }} />
      <circle cx="55" cy="45" r="5" fill="currentColor" style={{ color: 'white' }} />
    </svg>
  );
}

export function HeartHandIllustration() {
  return (
    <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
      <path
        d="M50 85 C50 85 20 60 20 40 C20 25 30 20 40 25 C45 27 50 35 50 35 C50 35 55 27 60 25 C70 20 80 25 80 40 C80 60 50 85 50 85 Z"
        fill="currentColor"
        className="text-pink-500"
        stroke="currentColor"
        strokeWidth="2"
        style={{ color: 'black' }}
      />
    </svg>
  );
}

export function SpeakerIllustration() {
  return (
    <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
      <path
        d="M30 35 L45 35 L65 20 L65 80 L45 65 L30 65 Z"
        fill="currentColor"
        className="text-blue-600"
        stroke="currentColor"
        strokeWidth="2"
        style={{ color: 'black' }}
      />
      <path d="M75 35 Q85 50 75 65" stroke="currentColor" strokeWidth="3" className="text-blue-600" fill="none" />
      <path d="M82 28 Q95 50 82 72" stroke="currentColor" strokeWidth="3" className="text-blue-600" fill="none" />
    </svg>
  );
}

export function PeopleIllustration() {
  return (
    <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
      <circle cx="35" cy="25" r="8" fill="currentColor" className="text-yellow-500" />
      <path d="M35 35 L35 55 M25 45 L45 45 M30 55 L30 70 M40 55 L40 70" stroke="currentColor" strokeWidth="3" className="text-yellow-500" strokeLinecap="round" />
      
      <circle cx="65" cy="30" r="8" fill="currentColor" className="text-pink-500" />
      <path d="M65 40 L65 60 M55 50 L75 50 M60 60 L60 75 M70 60 L70 75" stroke="currentColor" strokeWidth="3" className="text-pink-500" strokeLinecap="round" />
    </svg>
  );
}

export function StarBurstShape() {
  return (
    <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
      <path
        d="M100 10 L110 90 L190 100 L110 110 L100 190 L90 110 L10 100 L90 90 Z"
        fill="currentColor"
        className="text-orange-400"
      />
      <circle cx="100" cy="100" r="20" fill="currentColor" className="text-yellow-400" />
    </svg>
  );
}

export function WavePattern() {
  return (
    <svg viewBox="0 0 200 100" fill="none" className="w-full h-full" preserveAspectRatio="none">
      <path
        d="M0 50 Q50 20 100 50 T200 50 L200 100 L0 100 Z"
        fill="currentColor"
      />
    </svg>
  );
}

