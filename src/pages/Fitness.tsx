import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Icon3D from '../components/Icon3D'
import { Back, Next, Prev } from '../components/Glyph'
import { award } from '../game'
import { SPORTS, dkey, useLocal } from '../store'

const DOW = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
export default function Fitness({ onBack }: { onBack: () => void }) {
  const [plan, setPlan] = useLocal<Record<string, string>>('fitness-plan', {})
  const [cur, setCur] = useState(() => { const d = new Date(); d.setDate(1); return d })
  const [sel, setSel] = useState<string | null>(null)
  const y = cur.getFullYear(), m = cur.getMonth()
  const offset = (new Date(y, m, 1).getDay() + 6) % 7
  const n = new Date(y, m + 1, 0).getDate()
  const today = dkey()
  const prefix = `${y}-${String(m + 1).padStart(2, '0')}`
  const count = Object.keys(plan).filter(k => k.startsWith(prefix)).length
  const sp = (id?: string) => SPORTS.find(s => s.id === id)
  const pick = (id: string | null) => {
    if (!sel) return
    const p = { ...plan }
    if (id) { p[sel] = id; award('fit:' + sel, 15) } else delete p[sel]
    setPlan(p); setSel(null)
  }
  return (
    <div className="scroll">
      <motion.button className="back" onClick={onBack} whileHover={{ x: -4 }} whileTap={{ scale: .85 }}><Back /></motion.button>
      <p className="eyebrow">Fitness planning</p>
      <h1><b>Get fit</b><br />ton planning sport</h1>
      <motion.div className="card" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <div className="row" style={{ marginBottom: 12 }}>
          <motion.button className="round" whileHover={{ scale: 1.12 }} whileTap={{ scale: .85 }} onClick={() => setCur(new Date(y, m - 1, 1))}><Prev /></motion.button>
          <b style={{ textTransform: 'capitalize' }}>{cur.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</b>
          <motion.button className="round" whileHover={{ scale: 1.12 }} whileTap={{ scale: .85 }} onClick={() => setCur(new Date(y, m + 1, 1))}><Next /></motion.button>
        </div>
        <div className="cal">
          {DOW.map((d, i) => <div className="h" key={i}>{d}</div>)}
          {Array.from({ length: offset }).map((_, i) => <div key={'e' + i} />)}
          {Array.from({ length: n }).map((_, i) => {
            const k = dkey(new Date(y, m, i + 1)); const s = sp(plan[k])
            return (
              <motion.button key={k} className={'day' + (k === today ? ' today' : '')} style={s ? { background: s.c } : undefined}
                whileHover={{ scale: 1.14, zIndex: 2 }} whileTap={{ scale: .88 }} onClick={() => setSel(k)}>
                <small>{i + 1}</small>
                <AnimatePresence>{s && <Icon3D key={s.id} name={s.id} size={30} initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} />}</AnimatePresence>
              </motion.button>
            )
          })}
        </div>
      </motion.div>
      <div className="card row"><div><h3>Ce mois-ci</h3><div className="mute">séances planifiées</div></div>
        <motion.div key={count} className="big" style={{ fontSize: 56, margin: 0 }} initial={{ scale: 1.4 }} animate={{ scale: 1 }}>{count}</motion.div></div>
      <AnimatePresence>
        {sel && (
          <motion.div className="sheet" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSel(null)}>
            <motion.div initial={{ y: 400 }} animate={{ y: 0 }} exit={{ y: 400 }} transition={{ type: 'spring', damping: 24, stiffness: 260 }} onClick={e => e.stopPropagation()}>
              <b>{new Date(sel + 'T12:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</b>
              <div className="sports">
                {SPORTS.map((s, i) => (
                  <motion.button key={s.id} className="sport" style={{ background: s.c }} onClick={() => pick(s.id)}
                    initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * .03 }} whileHover={{ y: -5, scale: 1.05 }} whileTap={{ scale: .92 }}>
                    <Icon3D name={s.id} size={52} />{s.label}
                  </motion.button>
                ))}
                <motion.button className="sport" style={{ background: '#ece9f1' }} onClick={() => pick(null)} whileHover={{ y: -5, scale: 1.05 }} whileTap={{ scale: .92 }}>
                  <Icon3D name="rest" size={52} />Repos
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
