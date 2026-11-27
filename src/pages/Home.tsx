import { motion } from 'framer-motion'
import Face from '../components/Face'
import Illus, { Logo } from '../components/Illus'
import { MOODS, dkey, useLocal } from '../store'

export type Route = 'home' | 'fap' | 'cheat' | 'fitness' | 'meditation'
const TILES: { r: Route; t: string; c: string; i: 'head' | 'burger' | 'dumbbell' | 'lotus' }[] = [
  { r: 'fap', t: 'NoFap\nCounter', c: 'var(--lav)', i: 'head' },
  { r: 'cheat', t: 'Cheat meal\nCounter', c: 'var(--yel)', i: 'burger' },
  { r: 'fitness', t: 'Fitness\nPlanning', c: 'var(--mint)', i: 'dumbbell' },
  { r: 'meditation', t: 'Méditation\nBreathing', c: 'var(--peach)', i: 'lotus' },
]

export default function Home({ go }: { go: (r: Route) => void }) {
  const [log, setLog] = useLocal<Record<string, string>>('mood-log', {})
  const today = dkey()
  const counts = MOODS.map(m => ({ ...m, n: Object.values(log).filter(v => v === m.id).length }))
  const total = Object.keys(log).length
  const max = Math.max(1, ...counts.map(c => c.n))
  const last7 = Array.from({ length: 7 }).map((_, i) => { const d = new Date(); d.setDate(d.getDate() - 6 + i); return { d, id: log[dkey(d)] } })
  return (
    <div className="scroll">
      <div className="top"><Logo /><div className="round">📈</div></div>
      <motion.div className="hero" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <p className="eyebrow">Mood-o-meter</p>
        <h1 style={{ marginBottom: 16 }}>Salut 👋<br />Comment tu te <b>sens</b> aujourd'hui ?</h1>
        <div className="moods">
          {MOODS.map(m => (
            <motion.button key={m.id} whileTap={{ scale: .85 }} animate={{ scale: log[today] === m.id ? 1.12 : 1 }}
              className={'mood' + (log[today] === m.id ? ' sel' : '')} onClick={() => setLog({ ...log, [today]: m.id })}>
              <Face id={m.id} />
            </motion.button>
          ))}
        </div>
      </motion.div>

      <div className="grid">
        {TILES.map((t, i) => (
          <motion.button key={t.r} className="tile" style={{ background: t.c }} onClick={() => go(t.r)}
            initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: .1 + i * .08 }} whileTap={{ scale: .96 }}>
            <span style={{ whiteSpace: 'pre-line' }}>{t.t}</span>
            <Illus name={t.i} /><div className="arrow">↗</div>
          </motion.button>
        ))}
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <div className="row"><h3>Stats du mood</h3><small style={{ color: 'var(--mute)' }}>{total} jours</small></div>
        <div className="bars" style={{ marginBottom: 14 }}>
          {counts.map(c => (
            <div key={c.id}>
              <motion.i initial={{ height: 6 }} animate={{ height: 6 + (c.n / max) * 80 }} style={{ background: c.color }} />
              <b style={{ color: 'var(--ink)' }}>{c.n}</b>{c.label}
            </div>
          ))}
        </div>
        <h3>7 derniers jours</h3>
        <div className="row">
          {last7.map(({ d, id }) => (
            <div key={d.toISOString()} style={{ textAlign: 'center', fontSize: 11, color: 'var(--mute)' }}>
              {id ? <Face id={id} size={34} /> : <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#eee' }} />}
              {d.toLocaleDateString('fr-FR', { weekday: 'narrow' })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
