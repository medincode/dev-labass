import { MOODS } from '../store'
export default function Face({ id, size = 48 }: { id: string; size?: number }) {
  const m = MOODS.find(x => x.id === id)!
  return (
    <svg width={size} height={size} viewBox="-24 -24 48 48">
      <circle r="23" fill={m.color} />
      <g stroke="#141414" strokeWidth="2" strokeLinecap="round" fill="none">
        {m.eyes === 'o' ? <><circle cx="-8" cy="-5" r=".8" fill="#141414" /><circle cx="8" cy="-5" r=".8" fill="#141414" /></> : <><path d="M-11 -5 Q-8 -2 -5 -5" /><path d="M5 -5 Q8 -2 11 -5" /></>}
        <path d={m.mouth} />
      </g>
    </svg>
  )
}
