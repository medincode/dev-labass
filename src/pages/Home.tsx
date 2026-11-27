import { motion } from 'framer-motion'
import Icon3D from '../components/Icon3D'
import NavIcon from '../components/NavIcons'
import MoodStrip from '../components/MoodStrip'
import logo from '../assets/brand/logo.webp'
import mascot from '../assets/brand/mascot.webp'
import { QUOTES } from '../data/quotes'
import { useOrbit } from '../components/useOrbit'
import { award, useGame } from '../game'
import { NAME, acts, daysSince, dkey, hello, newCounter, useLocal, type Counter } from '../store'

export type Route = 'home' | 'fap' | 'cheat' | 'fitness' | 'meditation' | 'mood' | 'rewards' | 'settings'
const HUB: { r: Route; label: string; icon: string; c: string; angle: number }[] = [
  { r: 'fap', label: 'Stay Clean', icon: 'nofap', c: 'var(--lav)', angle: -138 },
  { r: 'fitness', label: 'Get fit', icon: 'fitness', c: 'var(--mint)', angle: -42 },
  { r: 'meditation', label: 'Breath good', icon: 'meditation', c: 'var(--peach)', angle: 42 },
  { r: 'cheat', label: 'Eat Clean', icon: 'cheat', c: 'var(--yel)', angle: 138 },
]
const LETTER = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: .25, ease: 'easeOut' as const } } }
const list = { show: { transition: { staggerChildren: .03 } } }
const item = { hidden: { y: 26, opacity: 0, scale: .97 }, show: { y: 0, opacity: 1, scale: 1, transition: { type: 'spring' as const, stiffness: 260, damping: 20 } } }

export default function Home({ go }: { go: (r: Route) => void }) {
  const g = useGame()
  const [fap] = useLocal<Counter>('counter-fap', newCounter())
  const [cheat] = useLocal<Counter>('counter-cheat', newCounter())
  const [blog] = useLocal<Record<string, number[]>>('breath-log', {})
  const lastB = Object.keys(blog).sort().pop()
  const ago = lastB ? Math.round((Date.parse(dkey() + 'T12:00') - Date.parse(lastB + 'T12:00')) / 86400000) : null
  const month = dkey().slice(0, 7)
  const sessions = Object.keys(g.plan).filter(k => k.startsWith(month)).reduce((n, k) => n + acts(g.plan, k).length, 0)
  const stats = [
    { i: 'fap', v: daysSince(fap), l: 'Stay Clean', u: 'j' }, { i: 'cheat', v: daysSince(cheat), l: 'Eat Clean', u: 'j' },
    { i: 'fitness', v: sessions, l: 'Séances', u: '' }, { i: 'meditation', v: ago === null ? '—' : ago === 0 ? 'Auj.' : ago === 1 ? 'Hier' : `${ago}j`, l: 'Dernier Wim Hof', u: '' },
  ]
  // Mini-jeu : les 4 menus sont des satellites qu'on fait tourner (glisser) et qui gardent leur élan.
  const orbit = useOrbit(HUB.map(h => h.angle), 152, 178, () => award('spin:' + dkey(), 5))
  // Citation du jour : tirée au hasard mais stable pour la journée (pas modifiable).
  const q = Math.abs([...dkey()].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7)) % QUOTES.length
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
            <Icon3D name="star" size={30} />
            <div><b>Niv. {g.level}</b><div className="xpbar"><motion.i initial={{ width: 0 }} animate={{ width: g.pct + '%' }} transition={{ duration: 1, ease: 'easeOut' }} /></div></div>
          </motion.button>
        </div>
      </motion.div>

      <motion.div variants={item} style={{ marginBottom: 4 }}>
        <p className="eyebrow">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        <h1 style={{ marginBottom: 0 }}>{hello()} <b>{NAME}</b> !</h1>
      </motion.div>

      <motion.div variants={item}><MoodStrip onMore={() => go('mood')} /></motion.div>

      <motion.div ref={orbit.hub} className="hub" variants={item}>
        <span className="glow" /><span className="aura a1" /><span className="aura a2" />
        <span className="float mascot-wrap"><img src={mascot} alt="" className="mascot" draggable={false} /></span>
        <span className="shadow" />
        {HUB.map((h, i) => (
          <span key={h.r} ref={el => { orbit.els.current[i] = el }} className="orbit" {...orbit.bind} onClick={() => { if (!orbit.wasDrag()) go(h.r) }}>
            <motion.button className="obtn" aria-label={h.label} title={h.label} whileHover={{ scale: 1.1 }} whileTap={{ scale: .92 }}
              initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 14, delay: .25 + i * .1 }}>
              <span className="orb2" style={{ '--t': h.c } as React.CSSProperties}><Icon3D name={h.icon} size={58} /></span>
            </motion.button>
          </span>
        ))}
      </motion.div>

      <motion.figure className="quote2" variants={item}>
        <motion.blockquote variants={{ show: { transition: { staggerChildren: .028, delayChildren: .15 } } }} initial="hidden" whileInView="show" viewport={{ once: true, amount: .6 }}>
          <motion.span className="qm" variants={LETTER}>“</motion.span>
          {QUOTES[q].split(' ').map((w, wi) => (
            <span key={wi}><span className="qw">{[...w].map((ch, ci) => <motion.span key={ci} className="ql" variants={LETTER}>{ch}</motion.span>)}</span>{' '}</span>
          ))}
          <motion.span className="qm" variants={LETTER}>”</motion.span>
        </motion.blockquote>
      </motion.figure>

      <motion.div className="qs" variants={item}>
        {stats.map(t => (
          <motion.div key={t.l} className="qs-item glass" whileHover={{ y: -4 }}>
            <NavIcon name={t.i} size={24} /><b>{t.v}{t.u}</b><small>{t.l}</small>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}
