import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Icon3D from '../components/Icon3D'
import TitleLogo from '../components/TitleLogo'
import { Next, Prev } from '../components/Glyph'
import { award } from '../game'
import { NAME, SPORTS, acts, dkey, useLocal, type Plan } from '../store'

const DOW = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
export default function Fitness() {
  const [plan, setPlan] = useLocal<Plan>('fitness-plan', {})
  const [cur, setCur] = useState(() => { const d = new Date(); d.setDate(1); return d })
  const [sel, setSel] = useState<string | null>(null)
  const y = cur.getFullYear(), m = cur.getMonth()
  const offset = (new Date(y, m, 1).getDay() + 6) % 7
  const n = new Date(y, m + 1, 0).getDate()
  const today = dkey()
  const prefix = `${y}-${String(m + 1).padStart(2, '0')}`
  const count = Object.keys(plan).filter(k => k.startsWith(prefix)).reduce((n, k) => n + acts(plan, k).length, 0)
  const sp = (id: string) => SPORTS.find(s => s.id === id)!
  const toggle = (id: string) => {
    if (!sel) return
    const cur = acts(plan, sel), next = cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id]
    const p = { ...plan }; if (next.length) p[sel] = next; else delete p[sel]
    if (!cur.includes(id)) award('fit:' + sel, 15)
    setPlan(p)
  }
  const clear = () => { if (!sel) return; const p = { ...plan }; delete p[sel]; setPlan(p); setSel(null) }
  const selActs = sel ? acts(plan, sel) : []
  return (
    <div className="scroll">
      <TitleLogo name="getfit" alt="Get fit" />
      <p className="sub">{NAME}, ton planning sport</p>
      <motion.div className="card glass" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <div className="row" style={{ marginBottom: 12 }}>
          <motion.button className="round" whileHover={{ scale: 1.12 }} whileTap={{ scale: .85 }} onClick={() => setCur(new Date(y, m - 1, 1))}><Prev /></motion.button>
          <b style={{ textTransform: 'capitalize' }}>{cur.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</b>
          <motion.button className="round" whileHover={{ scale: 1.12 }} whileTap={{ scale: .85 }} onClick={() => setCur(new Date(y, m + 1, 1))}><Next /></motion.button>
        </div>
        <div className="cal">
          {DOW.map((d, i) => <div className="h" key={i}>{d}</div>)}
          {Array.from({ length: offset }).map((_, i) => <div key={'e' + i} />)}
          {Array.from({ length: n }).map((_, i) => {
            const k = dkey(new Date(y, m, i + 1)); const list = acts(plan, k).map(sp)
            const sz = list.length > 2 ? 18 : list.length === 2 ? 22 : 30
            return (
              <motion.button key={k} className={'day' + (k === today ? ' today' : '')} style={list[0] ? { background: list[0].c } : undefined}
                whileHover={{ scale: 1.14, zIndex: 2 }} whileTap={{ scale: .88 }} onClick={() => setSel(k)}>
                <small>{i + 1}</small>
                <div className="dayicons"><AnimatePresence>{list.slice(0, 4).map(s => <Icon3D key={s.id} name={s.id} size={sz} initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} />)}</AnimatePresence></div>
              </motion.button>
            )
          })}
        </div>
      </motion.div>
      <div className="card glass row"><div><h3>Ce mois-ci</h3><div className="mute">séances planifiées</div></div>
        <motion.div key={count} className="big" style={{ fontSize: 56, margin: 0 }} initial={{ scale: 1.4 }} animate={{ scale: 1 }}>{count}</motion.div></div>
      <AnimatePresence>
        {sel && (
          <motion.div className="sheet" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSel(null)}>
            <motion.div initial={{ y: 400 }} animate={{ y: 0 }} exit={{ y: 400 }} transition={{ type: 'spring', damping: 24, stiffness: 260 }} onClick={e => e.stopPropagation()}>
              <b>{new Date(sel + 'T12:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</b>
              <small className="mute">Touche pour ajouter ou retirer, tu peux en choisir plusieurs.</small>
              <div className="sports">
                {SPORTS.map((s, i) => {
                  const on = selActs.includes(s.id)
                  return (
                    <motion.button key={s.id} className={'sport' + (on ? ' on' : '')} style={{ background: s.c }} onClick={() => toggle(s.id)}
                      initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * .03 }} whileHover={{ y: -5, scale: 1.05 }} whileTap={{ scale: .92 }}>
                      <Icon3D name={s.id} size={52} />{s.label}
                      <AnimatePresence>{on && <Icon3D name="check" size={24} className="sel-tick" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} />}</AnimatePresence>
                    </motion.button>
                  )
                })}
              </div>
              <div className="actions" style={{ marginTop: 16 }}>
                {selActs.length > 0 && <motion.button className="pill ghost" whileTap={{ scale: .92 }} onClick={clear}>Tout retirer</motion.button>}
                <motion.button className="pill" whileTap={{ scale: .92 }} onClick={() => setSel(null)}>Valider</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
