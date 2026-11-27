import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Next, Prev } from '../components/Glyph'
import { useRail } from '../components/useRail'
import Icon3D from '../components/Icon3D'
import TitleLogo from '../components/TitleLogo'
import { award, useGame } from '../game'
import { MOODS, NAME, dkey, useLocal } from '../store'

const MSG: Record<string, string> = {
  happy: 'Profite à fond de cette énergie !', calm: 'Reste dans cette zen attitude.', angry: 'Respire un coup, ça va passer.',
  excited: 'Utilise cette énergie pour ton sport !', sad: 'Ça arrive à tout le monde. Une petite respiration ?', stress: 'Un peu de breathing et ça ira mieux.',
}
export default function Mood() {
  const g = useGame()
  const [log, setLog] = useLocal<Record<string, string>>('mood-log', {})
  const cur = log[g.today]
  const counts = MOODS.map(m => ({ ...m, n: Object.values(log).filter(v => v === m.id).length }))
  const max = Math.max(1, ...counts.map(c => c.n))
  const top = [...counts].sort((a, b) => b.n - a.n)[0]
  const days = Array.from({ length: 28 }).map((_, i) => { const d = new Date(); d.setDate(d.getDate() - 27 + i); return { d, id: log[dkey(d)] } })
  const rail = useRail(122)
  const [focus, setFocus] = useState(Math.max(0, MOODS.findIndex(m => m.id === cur)))
  const W = 122
  const go = (i: number) => rail.ref.current?.scrollTo({ left: i * W, behavior: 'smooth' })
  useEffect(() => { rail.ref.current?.scrollTo({ left: focus * W }) }, [])  // eslint-disable-line react-hooks/exhaustive-deps
  const shown = MOODS[focus].id
  const pick = (id: string) => { setLog({ ...log, [g.today]: id }); award('mood:' + g.today, 10) }
  return (
    <div className="scroll">
      <TitleLogo name="mood" alt="Mood-o-meter" />
      <p className="sub">Comment tu te sens aujourd'hui ?</p>
      <motion.div className="hero glass" style={{ '--t': 'var(--peach)' } as React.CSSProperties} initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        {rail.can && <button className="arr l glass" aria-label="Précédent" onClick={() => rail.by(-1)}><Prev /></button>}
        {rail.can && <button className="arr r glass" aria-label="Suivant" onClick={() => rail.by(1)}><Next /></button>}
        <div ref={rail.ref} {...rail.bind} className="carousel" onScroll={e => setFocus(Math.min(MOODS.length - 1, Math.max(0, Math.round(e.currentTarget.scrollLeft / W))))}>
          {MOODS.map((m, i) => (
            <motion.button key={m.id} className={'citem' + (focus === i ? ' focus' : '') + (cur === m.id ? ' chosen' : '')} aria-label={m.label}
              onClick={() => { if (rail.moved()) return; go(i); pick(m.id) }} whileTap={{ scale: .94 }}>
              <Icon3D name={'mood-' + m.id} size={focus === i ? 96 : 68} float={focus === i} />
              <b>{m.label}</b>
              {cur === m.id && <motion.span className="chip glass" initial={{ scale: 0 }} animate={{ scale: 1 }}>Mon mood</motion.span>}
            </motion.button>
          ))}
        </div>
        <motion.p key={shown} className="msg center" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          {cur === shown ? MSG[shown] : `Touche pour choisir ${MOODS[focus].label.toLowerCase()}, ${NAME} (+10 XP).`}
        </motion.p>
      </motion.div>

      <motion.div className="card glass" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: .08 }}>
        <div className="row"><h3>Tes stats</h3><small className="mute">{Object.keys(log).length} jour{Object.keys(log).length > 1 ? 's' : ''} suivis</small></div>
        <div className="bars" style={{ marginBottom: 6 }}>
          {counts.map(c => (
            <div key={c.id}>
              <motion.i initial={{ height: 6 }} animate={{ height: 6 + (c.n / max) * 80 }} transition={{ type: 'spring', stiffness: 120, damping: 14 }} style={{ background: c.color }} />
              <Icon3D name={'mood-' + c.id} size={30} whileHover={{ scale: 1.3, rotate: 10 }} /><b>{c.n}</b>
            </div>
          ))}
        </div>
        {top.n > 0 && <p className="mute" style={{ margin: '8px 0 0', fontSize: 13 }}>Ton mood le plus fréquent, {NAME} : <b style={{ color: 'var(--ink)' }}>{top.label}</b></p>}
      </motion.div>

      <motion.div className="card glass" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: .16 }}>
        <h3>28 derniers jours</h3>
        <div className="mgrid">
          {days.map(({ d, id }) => (
            <motion.div key={d.toISOString()} className="mcell" whileHover={{ scale: 1.2 }} title={d.toLocaleDateString('fr-FR')}>
              {id ? <Icon3D name={'mood-' + id} size={34} /> : <div className="dot" />}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
