import { motion } from 'framer-motion'
import Icon3D from '../components/Icon3D'
import MoodStrip from '../components/MoodStrip'
import NavIcon from '../components/NavIcons'
import logo from '../assets/brand/logo.webp'
import mascot from '../assets/brand/mascot.webp'
import { QUOTES } from '../data/quotes'
import { useGame } from '../game'
import { NAME, dkey, hello } from '../store'

export type Route = 'home' | 'fap' | 'cheat' | 'fitness' | 'meditation' | 'mood' | 'rewards' | 'settings'
const HUB: { r: Route; label: string; icon: string; c: string; cls: string }[] = [
  { r: 'fap', label: 'Stay Clean', icon: 'nofap', c: 'var(--lav)', cls: 'b0' },
  { r: 'fitness', label: 'Get fit', icon: 'fitness', c: 'var(--mint)', cls: 'b1' },
  { r: 'cheat', label: 'Eat Clean', icon: 'cheat', c: 'var(--yel)', cls: 'b2' },
  { r: 'meditation', label: 'Breath good', icon: 'meditation', c: 'var(--peach)', cls: 'b3' },
]
const list = { show: { transition: { staggerChildren: .07 } } }
const item = { hidden: { y: 26, opacity: 0, scale: .97 }, show: { y: 0, opacity: 1, scale: 1, transition: { type: 'spring' as const, stiffness: 260, damping: 20 } } }

export default function Home({ go }: { go: (r: Route) => void }) {
  const g = useGame()
  // Citation du jour : tirée au hasard mais stable pour la journée (pas modifiable).
  const q = Math.abs([...dkey()].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7)) % QUOTES.length
  const done = g.quests.filter(x => x.done).length
  return (
    <motion.div className="scroll" variants={list} initial="hidden" animate="show">
      <motion.div className="top" variants={item}>
        <div className="brandrow">
          <motion.img src={logo} alt="Labass" className="brand" whileHover={{ scale: 1.06, rotate: -2 }} />
          <span className="vbadge glass">v{__APP_VERSION__}</span>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <motion.button className="round glass" aria-label="Paramètres" onClick={() => go('settings')} whileHover={{ rotate: 60, scale: 1.08 }} whileTap={{ scale: .88 }}><NavIcon name="settings" size={22} /></motion.button>
          <motion.button className="lvl glass" onClick={() => go('rewards')} whileHover={{ scale: 1.06 }} whileTap={{ scale: .94 }}>
            <Icon3D name="star" size={30} float />
            <div><b>Niv. {g.level}</b><div className="xpbar"><motion.i initial={{ width: 0 }} animate={{ width: g.pct + '%' }} transition={{ duration: 1, ease: 'easeOut' }} /></div></div>
          </motion.button>
        </div>
      </motion.div>

      <motion.div variants={item} style={{ marginBottom: 4 }}>
        <p className="eyebrow">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        <h1 style={{ marginBottom: 0 }}>{hello()} <b>{NAME}</b> !</h1>
      </motion.div>

      <motion.div variants={item}><MoodStrip onMore={() => go('mood')} /></motion.div>

      <motion.div className="hub" variants={item}>
        <span className="glow" /><span className="aura a1" /><span className="aura a2" />
        <span className="float mascot-wrap"><img src={mascot} alt="" className="mascot" draggable={false} /></span>
        <span className="shadow" />
        {HUB.map((h, i) => (
          <motion.button key={h.r} className={'bubble ' + h.cls} onClick={() => go(h.r)} whileHover={{ scale: 1.1 }} whileTap={{ scale: .9 }}
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 14, delay: .25 + i * .1 }}>
            <span className="float" style={{ animationDelay: `${i * .5}s` }}>
              <span className="orb2" style={{ '--t': h.c } as React.CSSProperties}><Icon3D name={h.icon} size={64} /></span>
            </span>
            {h.label}
          </motion.button>
        ))}
      </motion.div>

      <motion.figure className="quote2 glass" variants={item}>
        <blockquote>« {QUOTES[q]} »</blockquote>
      </motion.figure>

      <motion.button className="wide glass" variants={item} onClick={() => go('rewards')} whileHover={{ y: -3 }} whileTap={{ scale: .97 }}>
        <Icon3D name="trophy" size={54} float delay={.5} />
        <div><b>Récompenses</b><small>{done}/3 quêtes · niveau {g.level}</small></div>
      </motion.button>
    </motion.div>
  )
}
