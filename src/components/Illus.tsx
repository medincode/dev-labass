import type { ReactElement } from 'react'
// Illustrations « dessinées à la main » : traits noirs irréguliers, arrondis.
const S = { fill: 'none', stroke: '#141414', strokeWidth: 2.6, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

const art: Record<string, ReactElement> = {
  head: (<g {...S}>
    <path d="M60 170 C58 130 40 120 46 90 C52 50 100 34 128 56 C150 74 144 100 150 116 L134 122 L140 140 C128 150 112 148 108 160 L108 170" />
    <path d="M60 170 L108 170" /><circle cx="116" cy="84" r="3" fill="#141414" />
    <path d="M98 40 C96 20 120 6 140 18 C132 40 116 44 98 40 Z" /><path d="M98 40 C94 30 88 24 78 22 C80 36 88 42 98 40" />
    <path d="M98 40 L98 24" />
  </g>),
  burger: (<g {...S}>
    <path d="M40 90 C40 50 160 50 160 90 Z" /><path d="M40 110 Q60 100 80 112 T120 112 T160 110" />
    <path d="M40 126 H160" /><path d="M42 144 C44 166 156 166 158 144 Z" />
    <circle cx="70" cy="76" r="2" /><circle cx="100" cy="68" r="2" /><circle cx="128" cy="78" r="2" />
    <rect x="128" y="140" width="38" height="30" rx="8" transform="translate(0 -4)" /><path d="M138 136 V126 a10 10 0 0 1 20 0 V136" />
  </g>),
  dumbbell: (<g {...S}>
    <path d="M44 84 V116 M62 74 V126 M138 74 V126 M156 84 V116 M62 100 H138 M44 100 H36 M156 100 H164" />
    <path d="M60 150 C76 130 96 130 112 150 C100 168 74 168 60 150 Z" /><path d="M86 130 V168" />
    <circle cx="150" cy="150" r="14" /><path d="M160 160 L180 182" />
  </g>),
  lotus: (<g {...S}>
    <circle cx="100" cy="52" r="16" /><path d="M100 68 C84 80 80 104 84 118 M100 68 C116 80 120 104 116 118" />
    <path d="M30 144 C56 124 84 128 100 132 C116 128 144 124 170 144 C140 156 120 150 100 150 C80 150 60 156 30 144 Z" />
    <path d="M92 100 C100 108 108 108 116 100" />
    <path d="M20 70 C40 60 40 80 60 70 M140 84 C160 74 160 94 182 84" />
    <path d="M70 176 C80 160 90 160 100 176 C110 160 120 160 130 176" />
  </g>),
  mood: (<g {...S}>
    <path d="M62 170 C58 134 40 124 46 92 C52 54 100 38 128 60 C150 78 144 104 150 120 L134 126 L140 144 C128 154 112 152 108 164 L108 170 Z" />
    <circle cx="100" cy="90" r="18" /><circle cx="94" cy="86" r="1.5" fill="#141414" /><circle cx="106" cy="86" r="1.5" fill="#141414" /><path d="M92 96 Q100 104 108 96" />
    <path d="M100 62 V54 M120 70 L126 64 M80 70 L74 64 M126 90 H134" />
  </g>),
  ice: (<g {...S}>
    <rect x="40" y="110" width="120" height="62" rx="14" /><path d="M40 128 H160" />
    <circle cx="100" cy="98" r="14" /><path d="M86 112 C90 124 110 124 114 112" />
    <path d="M60 84 l10 -10 l10 10 l-10 10 z M138 70 v20 M128 80 h20 M131 73 l14 14 M145 73 l-14 14" />
  </g>),
}

export default function Illus({ name, className = 'illus' }: { name: keyof typeof art; className?: string }) {
  return <svg className={className} viewBox="0 0 200 200">{art[name]}</svg>
}
export const Logo = () => (
  <svg className="logo" viewBox="0 0 28 28"><g fill="#111"><rect x="11" y="1" width="6" height="12" rx="3" transform="rotate(45 14 14)"/><rect x="11" y="15" width="6" height="12" rx="3" transform="rotate(45 14 14)"/><rect x="1" y="11" width="12" height="6" rx="3" transform="rotate(45 14 14)"/><rect x="15" y="11" width="12" height="6" rx="3" transform="rotate(45 14 14)"/></g></svg>
)
