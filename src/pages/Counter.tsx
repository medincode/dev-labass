import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Illus from '../components/Illus'
import { type Counter as C, DAY, newCounter, useLocal } from '../store'

type Props = { id: string; title: string; sub: string; bg: string; illus: 'head' | 'burger'; onBack: () => void }

export default function CounterPage({ id, title, sub, bg, illus, onBack }: Props) {
  const [c, setC] = useLocal<C>('counter-' + id, newCounter())
  const [, tick] = useState(0)
  useEffect(() => { const t = setInterval(() => tick(x => x + 1), 60000); return () => clearInterval(t) }, [])
  const days = Math.floor((Date.now() - c.start) / DAY)
  const hours = Math.floor(((Date.now() - c.start) % DAY) / 3600000)
  const lens = c.history.map(h => Math.floor((h.end - h.start) / DAY))
  const best = Math.max(days, ...lens, 0)
  const avg = lens.length ? Math.round(lens.reduce((a, b) => a + b, 0) / lens.length) : days
  const reset = () => {
    if (!confirm('Reset le compteur ? Tu perds ton streak.')) return
    setC({ start: Date.now(), history: [...c.history, { start: c.start, end: Date.now() }] })
  }
  return (
    <div className="scroll">
      <button className="back" onClick={onBack}>←</button>
      <p className="eyebrow">{sub}</p>
      <h1><b>{title}</b></h1>
      <motion.div className="hero" style={{ background: bg, position: 'relative', textAlign: 'center' }} initial={{ scale: .94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <Illus name={illus} className="cillus" />
        <motion.div key={days} className="big" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>{days}</motion.div>
        <div>jour{days > 1 ? 's' : ''} · {hours}h depuis le dernier relapse</div>
      </motion.div>
      <div className="row" style={{ gap: 10, marginBottom: 14 }}>
        <div className="stat" style={{ background: '#fff' }}><b>{best}</b><small>meilleur streak</small></div>
        <div className="stat" style={{ background: '#fff' }}><b>{c.history.length}</b><small>relapses</small></div>
        <div className="stat" style={{ background: '#fff' }}><b>{avg}</b><small>moy. jours</small></div>
      </div>
      <button className="pill" style={{ width: '100%', padding: 16 }} onClick={reset}>J'ai relapse · reset</button>
      {c.history.length > 0 && (
        <div className="card" style={{ marginTop: 14 }}>
          <h3>Historique</h3>
          {[...c.history].reverse().slice(0, 12).map((h, i) => (
            <div key={i} className="row" style={{ padding: '6px 0', fontSize: 14 }}>
              <span>{new Date(h.start).toLocaleDateString('fr-FR')} → {new Date(h.end).toLocaleDateString('fr-FR')}</span>
              <b>{Math.floor((h.end - h.start) / DAY)} j</b>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
