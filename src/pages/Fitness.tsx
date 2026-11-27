import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Icon3D from '../components/Icon3D'
import TitleLogo from '../components/TitleLogo'
import { Next, Prev } from '../components/Glyph'
import { award } from '../game'
import { GROUPS, PROGRAMS } from '../data/programs'
import { NAME, SPORTS, acts, dkey, useLocal, type Plan } from '../store'

const DOW = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
export default function Fitness() {
  const [plan, setPlan] = useLocal<Plan>('fitness-plan', {})
  const [cur, setCur] = useState(() => { const d = new Date(); d.setDate(1); return d })
  const [sel, setSel] = useState<string | null>(null)
  const [grp, setGrp] = useState<string | null>(null)
  const [prog, setProg] = useState<string>('')
  const group = GROUPS.find(g => g.id === grp)
  const openGroup = (id: string) => { const g = GROUPS.find(x => x.id === id)!; setGrp(grp === id ? null : id); setProg(g.ids[0]) }
  const addToday = (id: string) => { const cur = acts(plan, today); if (!cur.includes(id)) { setPlan({ ...plan, [today]: [...cur, id] }); award('fit:' + today, 15) } }
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
      <div className="card glass">
        <h3>Tes sports</h3>
        <div className="sportrail">
          {GROUPS.map(g => (
            <motion.button key={g.id} className={'sitem' + (grp === g.id ? ' on' : '')} onClick={() => openGroup(g.id)} whileHover={{ y: -4 }} whileTap={{ scale: .92 }}>
              <Icon3D name={g.icon} size={grp === g.id ? 70 : 58} float={grp === g.id} /><b>{g.label}</b>
              {g.ids.length > 1 && <small>V1 · V2 · V3</small>}
            </motion.button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          {group && (
            <motion.div key={group.id} className="progpanel" initial={{ opacity: 0, y: 14, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              {group.ids.length > 1 && (
                <div className="tabs glass" role="tablist">
                  {group.ids.map((id, i) => (
                    <motion.button key={id} role="tab" aria-selected={prog === id} className={prog === id ? 'on' : ''} onClick={() => setProg(id)} whileTap={{ scale: .92 }}>
                      {prog === id && <motion.i layoutId="progpill" className="pill-bg" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
                      <Icon3D name={id} size={prog === id ? 42 : 34} /><span>V{i + 1}</span>
                    </motion.button>
                  ))}
                </div>
              )}
              <div className="row" style={{ margin: '4px 0 8px' }}><h3 style={{ margin: 0 }}>{PROGRAMS[prog || group.ids[0]].title}</h3>
                <motion.button className="pill" whileTap={{ scale: .92 }} onClick={() => addToday(prog || group.ids[0])}>+ Aujourd'hui</motion.button></div>
              {PROGRAMS[prog || group.ids[0]].exercises.length === 0
                ? <p className="mute" style={{ margin: 0 }}>{NAME}, le contenu de ce programme arrive bientôt.</p>
                : PROGRAMS[prog || group.ids[0]].exercises.map((e, i) => (
                  <motion.div key={e.name} className="quest" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * .04 }}>
                    <span>{e.name}</span>{e.detail && <b>{e.detail}</b>}
                  </motion.div>
                ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
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
