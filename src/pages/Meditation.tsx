import { AnimatePresence, motion } from 'framer-motion'
import { Next, Prev } from '../components/Glyph'
import { useState } from 'react'
import Icon3D from '../components/Icon3D'
import TitleLogo from '../components/TitleLogo'
import VideoPlayer from '../components/VideoPlayer'
import { award, useGame } from '../game'
import { dkey, useLocal } from '../store'

const LEVELS = [
  { n: 1, c: '#b9e6d6', label: 'Niveau 1', sub: 'Débutant' },
  { n: 2, c: '#f6e07c', label: 'Niveau 2', sub: 'Intermédiaire' },
  { n: 3, c: '#b9bdff', label: 'Niveau 3', sub: 'Avancé' },
]
const DOW = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
/** Calendrier Wim Hof : un jour est coché dès qu'une vidéo a été lancée. */
function BreathCalendar({ log }: { log: Record<string, number[]> }) {
  const [cur, setCur] = useState(() => { const d = new Date(); d.setDate(1); return d })
  const y = cur.getFullYear(), m = cur.getMonth(), today = dkey()
  const offset = (new Date(y, m, 1).getDay() + 6) % 7, n = new Date(y, m + 1, 0).getDate()
  const prefix = `${y}-${String(m + 1).padStart(2, '0')}`
  const count = Object.keys(log).filter(k => k.startsWith(prefix)).length
  return (
    <div className="card glass">
      <div className="row" style={{ marginBottom: 10 }}>
        <motion.button className="round glass" aria-label="Mois précédent" whileTap={{ scale: .85 }} onClick={() => setCur(new Date(y, m - 1, 1))}><Prev /></motion.button>
        <div className="center"><b style={{ textTransform: 'capitalize' }}>{cur.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</b><br /><small className="mute">{count} jour{count > 1 ? 's' : ''} de breathing</small></div>
        <motion.button className="round glass" aria-label="Mois suivant" whileTap={{ scale: .85 }} onClick={() => setCur(new Date(y, m + 1, 1))}><Next /></motion.button>
      </div>
      <div className="cal">
        {DOW.map((d, i) => <div className="h" key={i}>{d}</div>)}
        {Array.from({ length: offset }).map((_, i) => <div key={'e' + i} />)}
        {Array.from({ length: n }).map((_, i) => {
          const k = dkey(new Date(y, m, i + 1)), done = !!log[k]
          return (
            <div key={k} className={'day' + (k === today ? ' today' : '') + (done ? ' checked' : '')}>
              <small>{i + 1}</small>
              <AnimatePresence>{done && <Icon3D name="check" size={26} initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} />}</AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Meditation() {
  const g = useGame()
  const [blog, setBlog] = useLocal<Record<string, number[]>>('breath-log', {})
  const launched = (lvl: number) => { const k = dkey(), cur = blog[k] ?? []; if (!cur.includes(lvl)) setBlog({ ...blog, [k]: [...cur, lvl] }) }
  const [lvl, setLvl] = useState(1)
  const cur = LEVELS[lvl - 1]
  return (
    <div className="scroll">
      <TitleLogo name="breathgood" alt="Breath good" />
      <p className="sub">Méthode Wim Hof</p>
      <div className="tabs glass" role="tablist">
        {LEVELS.map(l => (
          <motion.button key={l.n} role="tab" aria-selected={lvl === l.n} className={lvl === l.n ? 'on' : ''} onClick={() => setLvl(l.n)} whileTap={{ scale: .92 }}>
            {lvl === l.n && <motion.i layoutId="tabpill" className="pill-bg" style={{ background: l.c }} transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
            <Icon3D name={'lvl' + l.n} size={lvl === l.n ? 46 : 38} animate={{ y: lvl === l.n ? -2 : 0 }} />
            <span>{l.label}</span>
            {g.awards['video:' + l.n] && <Icon3D name="check" size={18} className="tick" />}
          </motion.button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div className="card glass" key={lvl} style={{ '--t': cur.c } as React.CSSProperties}
          initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -40, opacity: 0 }} transition={{ duration: .22 }}>
          <div className="row" style={{ marginBottom: 12 }}>
            <div><h3 style={{ margin: 0 }}>{cur.label}</h3><small className="mute">{cur.sub} · +25 XP à la fin</small></div>
            <Icon3D name={'lvl' + lvl} size={52} float />
          </div>
          <VideoPlayer src={`${import.meta.env.BASE_URL}videos/breathing-lvl${lvl}.mp4`} onStart={() => launched(lvl)}
            onEnded={() => { award('video:' + lvl, 25); award('breath:' + g.today, 20) }} />
        </motion.div>
      </AnimatePresence>
      <BreathCalendar log={blog} />
    </div>
  )
}
