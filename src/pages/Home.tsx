import { motion } from 'framer-motion'
import Icon3D from '../components/Icon3D'
import { Arrow } from '../components/Glyph'
import logo from '../assets/brand/logo.webp'
import { useGame } from '../game'
import { NAME, SPORTS, acts, daysSince, hello, newCounter, useLocal, type Counter } from '../store'

export type Route = 'home' | 'fap' | 'cheat' | 'fitness' | 'meditation' | 'mood' | 'rewards'
const list = { show: { transition: { staggerChildren: .07 } } }
const item = { hidden: { y: 26, opacity: 0, scale: .97 }, show: { y: 0, opacity: 1, scale: 1, transition: { type: 'spring' as const, stiffness: 260, damping: 20 } } }

export default function Home({ go }: { go: (r: Route) => void }) {
  const g = useGame()
  const [fap] = useLocal<Counter>('counter-fap', newCounter())
  const [cheat] = useLocal<Counter>('counter-cheat', newCounter())
  const todays = acts(g.plan, g.today).map(id => SPORTS.find(s => s.id === id)!).filter(Boolean)
  const sport = todays[0]
  const mood = g.moods[g.today]
  const done = g.quests.filter(q => q.done).length
  const tiles = [
    { r: 'fap' as Route, t: 'Stay Clean', sub: `${daysSince(fap)} jour${daysSince(fap) > 1 ? 's' : ''}`, c: 'var(--lav)', i: 'nofap' },
    { r: 'cheat' as Route, t: 'Eat Clean', sub: `${daysSince(cheat)} jour${daysSince(cheat) > 1 ? 's' : ''}`, c: 'var(--yel)', i: 'cheat' },
    { r: 'fitness' as Route, t: 'Get fit', sub: todays.length > 1 ? `${todays.length} activités` : sport ? sport.label : 'Repos aujourd\'hui', c: 'var(--mint)', i: sport ? sport.id : 'fitness' },
    { r: 'meditation' as Route, t: 'Breath good', sub: g.awards['breath:' + g.today] ? 'Fait aujourd\'hui' : 'À faire', c: 'var(--peach)', i: 'meditation' },
  ]
  return (
    <motion.div className="scroll" variants={list} initial="hidden" animate="show">
      <motion.div className="top" variants={item}>
        <div className="brandrow">
          <motion.img src={logo} alt="Labass" className="brand" whileHover={{ scale: 1.06, rotate: -2 }} />
          <span className="vbadge glass">v{__APP_VERSION__}</span>
        </div>
        <motion.button className="lvl glass" onClick={() => go('rewards')} whileHover={{ scale: 1.06 }} whileTap={{ scale: .94 }}>
          <Icon3D name="star" size={30} float />
          <div><b>Niv. {g.level}</b><div className="xpbar"><motion.i initial={{ width: 0 }} animate={{ width: g.pct + '%' }} transition={{ duration: 1, ease: 'easeOut' }} /></div></div>
        </motion.button>
      </motion.div>

      <motion.div variants={item} style={{ marginBottom: 20 }}>
        <p className="eyebrow">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        <h1>{hello()} <b>{NAME}</b>,<br />on fait quoi de bien aujourd'hui ?</h1>
      </motion.div>

      <div className="grid">
        {tiles.map((t, i) => (
          <motion.button key={t.r} className="tile glass" style={{ '--t': t.c } as React.CSSProperties} onClick={() => go(t.r)} variants={item}
            whileHover={{ y: -6, scale: 1.03 }} whileTap={{ scale: .95 }}>
            <span>{t.t}<small>{t.sub}</small></span>
            <Icon3D name={t.i} size={92} float delay={i * .4} className="tile-ico" />
            <div className="arrow"><Arrow /></div>
          </motion.button>
        ))}
      </div>

      <motion.button className="wide glass" variants={item} onClick={() => go('mood')} whileHover={{ y: -3 }} whileTap={{ scale: .97 }}>
        <Icon3D name={mood ? 'mood-' + mood : 'mood-happy'} size={58} float />
        <div><b>Mood-o-meter</b><small>{mood ? `Ton mood du jour, ${NAME}` : `Comment tu te sens, ${NAME} ?`}</small></div><Arrow />
      </motion.button>
      <motion.button className="wide glass" variants={item} onClick={() => go('rewards')} whileHover={{ y: -3 }} whileTap={{ scale: .97 }}>
        <Icon3D name="trophy" size={58} float delay={.5} />
        <div><b>Récompenses</b><small>{done}/3 quêtes · niveau {g.level}</small></div><Arrow />
      </motion.button>
    </motion.div>
  )
}
