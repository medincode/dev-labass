import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Illus from '../components/Illus'

const LEVELS = [
  { n: 1, name: 'Niveau 1', c: '#cde6dd', id: 'tybOi4hjZFQ' },
  { n: 2, name: 'Niveau 2', c: '#f1df88', id: 'YkE8AObpzm4' },
  { n: 3, name: 'Niveau 3', c: '#bcc0ff', id: 'u8j7Ir_cg0M' },
]
const PHASES = [['Inspire', 4], ['Retiens', 4], ['Expire', 6]] as const

function Breather() {
  const [p, setP] = useState(0)
  useEffect(() => { const t = setTimeout(() => setP((p + 1) % 3), PHASES[p][1] * 1000); return () => clearTimeout(t) }, [p])
  return (
    <div style={{ display: 'grid', placeItems: 'center', height: 220 }}>
      <motion.div animate={{ scale: p === 2 ? 0.6 : 1 }} transition={{ duration: PHASES[p][1], ease: 'easeInOut' }}
        style={{ width: 170, height: 170, borderRadius: '50%', background: 'var(--mint)', display: 'grid', placeItems: 'center', fontWeight: 600 }}>
        <motion.span key={p} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{PHASES[p][0]}</motion.span>
      </motion.div>
    </div>
  )
}

export default function Meditation({ onBack }: { onBack: () => void }) {
  return (
    <div className="scroll">
      <button className="back" onClick={onBack}>←</button>
      <p className="eyebrow">Méditation</p>
      <h1><b>Breathing</b><br />Wim Hof</h1>
      <div className="card" style={{ position: 'relative', overflow: 'hidden' }}><h3>Respiration guidée</h3><Breather /></div>
      {LEVELS.map(l => (
        <div className="card" key={l.n} style={{ background: l.c }}>
          <div className="row" style={{ marginBottom: 10 }}><h3 style={{ margin: 0 }}>{l.name}</h3><Illus name="lotus" className="mini" /></div>
          <iframe title={l.name} src={`https://www.youtube-nocookie.com/embed/${l.id}?playsinline=1&rel=0`} allow="accelerometer; encrypted-media; picture-in-picture; fullscreen" allowFullScreen style={{ width: '100%', aspectRatio: '16/9', border: 0, borderRadius: 20 }} />
        </div>
      ))}
    </div>
  )
}
