import { motion } from 'framer-motion'
import Icon3D from '../components/Icon3D'
import { Arrow } from '../components/Glyph'
import logo from '../assets/brand/logo.webp'
import { BADGES, award, useGame } from '../game'
import { MOODS, useLocal } from '../store'

export type Route = 'home' | 'fap' | 'cheat' | 'fitness' | 'meditation'
const TILES: { r: Route; t: string; c: string; i: string }[] = [
  { r: 'fap', t: 'Stay\nClean', c: 'var(--lav)', i: 'nofap' },
  { r: 'cheat', t: 'Eat\nClean', c: 'var(--yel)', i: 'cheat' },
  { r: 'fitness', t: 'Get\nfit', c: 'var(--mint)', i: 'fitness' },
  { r: 'meditation', t: 'Breath\ngood', c: 'var(--peach)', i: 'meditation' },
]
const list = { show: { transition: { staggerChildren: .08 } } }
const item = { hidden: { y: 28, opacity: 0, scale: .96 }, show: { y: 0, opacity: 1, scale: 1, transition: { type: 'spring' as const, stiffness: 260, damping: 20 } } }

export default function Home({ go }: { go: (r: Route) => void }) {
  const g = useGame()
  const [log, setLog] = useLocal<Record<string, string>>('mood-log', {})
  const counts = MOODS.map(m => ({ ...m, n: Object.values(log).filter(v => v === m.id).length }))
  const max = Math.max(1, ...counts.map(c => c.n))
  const last7 = Array.from({ length: 7 }).map((_, i) => { const d = new Date(); d.setDate(d.getDate() - 6 + i); return { d, id: log[d.toISOString().slice(0, 10)] } })
  const pick = (id: string) => { setLog({ ...log, [g.today]: id }); award('mood:' + g.today, 10) }
  return (
    <motion.div className="scroll" variants={list} initial="hidden" animate="show">
      <motion.div className="top" variants={item}>
        <motion.img src={logo} alt="Labass" className="brand" whileHover={{ scale: 1.06, rotate: -2 }} />
        <motion.div className="lvl" whileHover={{ scale: 1.05 }}>
          <Icon3D name="star" size={30} float />
          <div><b>Niv. {g.level}</b><div className="xpbar"><motion.i initial={{ width: 0 }} animate={{ width: g.pct + '%' }} transition={{ duration: 1, ease: 'easeOut' }} /></div></div>
        </motion.div>
      </motion.div>

      <motion.div className="hero" variants={item}>
        <p className="eyebrow">Mood-o-meter</p>
        <h1 style={{ marginBottom: 16 }}>Salut !<br />Comment tu te <b>sens</b> aujourd'hui ?</h1>
        <div className="moods">
          {MOODS.map(m => (
            <motion.button key={m.id} aria-label={m.label} whileHover={{ y: -8, scale: 1.15, rotate: 6 }} whileTap={{ scale: .8 }}
              animate={{ scale: log[g.today] === m.id ? 1.2 : 1 }} className={'mood' + (log[g.today] === m.id ? ' sel' : '')} onClick={() => pick(m.id)}>
              <Icon3D name={'mood-' + m.id} size={50} />
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.div className="card" variants={item}>
        <div className="row"><h3>Quêtes du jour</h3><small className="mute">{g.quests.filter(q => q.done).length}/3</small></div>
        {g.quests.map(q => (
          <motion.div key={q.id} className={'quest' + (q.done ? ' done' : '')} layout whileHover={{ x: 4 }}>
            <Icon3D name={q.done ? 'check' : 'star'} size={30} animate={q.done ? { scale: [1, 1.4, 1], rotate: [0, 12, 0] } : undefined} />
            <span>{q.label}</span><b>+{q.xp} XP</b>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid">
        {TILES.map((t, i) => (
          <motion.button key={t.r} className="tile" style={{ background: t.c }} onClick={() => go(t.r)} variants={item}
            whileHover={{ y: -6, scale: 1.03, rotate: i % 2 ? .8 : -.8 }} whileTap={{ scale: .95 }}>
            <span style={{ whiteSpace: 'pre-line' }}>{t.t}</span>
            <Icon3D name={t.i} size={96} float delay={i * .4} className="tile-ico" />
            <div className="arrow"><Arrow /></div>
          </motion.button>
        ))}
      </div>

      <motion.div className="card" style={{ marginTop: 14 }} variants={item}>
        <h3>Badges</h3>
        <div className="badges">
          {BADGES.map(b => (
            <motion.div key={b.id} className={'badge' + (g.earned[b.id] ? ' on' : '')} whileHover={{ y: -4, scale: 1.08 }} title={b.desc}>
              <Icon3D name={b.icon} size={46} float={g.earned[b.id]} /><small>{b.name}</small>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div className="card" variants={item}>
        <div className="row"><h3>Stats du mood</h3><small className="mute">{Object.keys(log).length} jours</small></div>
        <div className="bars" style={{ marginBottom: 14 }}>
          {counts.map(c => (
            <div key={c.id}>
              <motion.i initial={{ height: 6 }} animate={{ height: 6 + (c.n / max) * 80 }} transition={{ type: 'spring', stiffness: 120, damping: 14 }} style={{ background: c.color }} />
              <Icon3D name={'mood-' + c.id} size={30} whileHover={{ scale: 1.3, rotate: 10 }} /><b style={{ color: 'var(--ink)' }}>{c.n}</b>
            </div>
          ))}
        </div>
        <h3>7 derniers jours</h3>
        <div className="row">
          {last7.map(({ d, id }) => (
            <div key={d.toISOString()} style={{ textAlign: 'center', fontSize: 11, color: 'var(--mute)' }}>
              {id ? <Icon3D name={'mood-' + id} size={36} /> : <div className="dot" />}
              {d.toLocaleDateString('fr-FR', { weekday: 'narrow' })}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
