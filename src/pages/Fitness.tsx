import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
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
  const count = Object.keys(plan).filter(k => k.startsWith(`${y}-${String(m + 1).padStart(2, '0')}`)).length
  const sp = (id?: string) => SPORTS.find(s => s.id === id)
  const pick = (id: string | null) => {
    if (!sel) return
    const p = { ...plan }; if (id) p[sel] = id; else delete p[sel]
    setPlan(p); setSel(null)
  }
  return (
    <div className="scroll">
      <button className="back" onClick={onBack}>←</button>
      <p className="eyebrow">Fitness</p>
      <h1>Ton <b>planning</b><br />sport</h1>
      <div className="card">
        <div className="row" style={{ marginBottom: 12 }}>
          <button className="round" onClick={() => setCur(new Date(y, m - 1, 1))}>‹</button>
          <b style={{ textTransform: 'capitalize' }}>{cur.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</b>
          <button className="round" onClick={() => setCur(new Date(y, m + 1, 1))}>›</button>
        </div>
        <div className="cal">
          {DOW.map((d, i) => <div className="h" key={i}>{d}</div>)}
          {Array.from({ length: offset }).map((_, i) => <div key={'e' + i} />)}
          {Array.from({ length: n }).map((_, i) => {
            const k = dkey(new Date(y, m, i + 1)); const s = sp(plan[k])
            return (
              <motion.button whileTap={{ scale: .88 }} key={k} className={'day' + (k === today ? ' today' : '')} style={s ? { background: s.c } : undefined} onClick={() => setSel(k)}>
                <small>{i + 1}</small>{s && <em>{s.e}</em>}
              </motion.button>
            )
          })}
        </div>
      </div>
      <div className="card"><h3>Ce mois-ci</h3>
        <div className="big" style={{ fontSize: 56 }}>{count}<small style={{ fontSize: 16, color: 'var(--mute)' }}> séances planifiées</small></div>
      </div>
      <AnimatePresence>
        {sel && (
          <motion.div className="sheet" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSel(null)}>
            <motion.div initial={{ y: 300 }} animate={{ y: 0 }} exit={{ y: 300 }} transition={{ type: 'spring', damping: 26 }} onClick={e => e.stopPropagation()}>
              <b>{new Date(sel + 'T12:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</b>
              <div className="sports">
                {SPORTS.map(s => <button key={s.id} className="sport" style={{ background: s.c }} onClick={() => pick(s.id)}><em>{s.e}</em>{s.label}</button>)}
                <button className="sport" style={{ background: '#eee' }} onClick={() => pick(null)}><em>✕</em>Repos</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
