import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Icon3D from '../components/Icon3D'
import { Back } from '../components/Glyph'
import { award, useGame } from '../game'

const LEVELS = [
  { n: 1, c: '#cde6dd', id: 'tybOi4hjZFQ' },
  { n: 2, c: '#f1df88', id: 'YkE8AObpzm4' },
  { n: 3, c: '#bcc0ff', id: 'u8j7Ir_cg0M' },
]
const PHASES = [['Inspire', 4], ['Retiens', 4], ['Expire', 6]] as const

function Breather() {
  const [p, setP] = useState(0)
  useEffect(() => { const t = setTimeout(() => setP((p + 1) % 3), PHASES[p][1] * 1000); return () => clearTimeout(t) }, [p])
  return (
    <div style={{ display: 'grid', placeItems: 'center', height: 240 }}>
      <motion.div animate={{ scale: p === 2 ? 0.62 : 1 }} transition={{ duration: PHASES[p][1], ease: 'easeInOut' }} className="orb">
        <Icon3D name="breath" size={90} float />
        <motion.b key={p} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>{PHASES[p][0]}</motion.b>
      </motion.div>
    </div>
  )
}

export default function Meditation({ onBack }: { onBack: () => void }) {
  const g = useGame(); const done = !!g.awards['breath:' + g.today]
  return (
    <div className="scroll">
      <motion.button className="back" onClick={onBack} whileHover={{ x: -4 }} whileTap={{ scale: .85 }}><Back /></motion.button>
      <p className="eyebrow">Méditation · Breathing</p>
      <h1><b>Breath good</b><br />méthode Wim Hof</h1>
      <motion.div className="card" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <h3>Respiration guidée</h3><Breather />
        <motion.button className={'pill' + (done ? ' ghost' : '')} style={{ width: '100%', padding: 14 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: .95 }}
          onClick={() => award('breath:' + g.today, 20)}>{done ? 'Séance du jour terminée' : "J'ai terminé ma séance · +20 XP"}</motion.button>
      </motion.div>
      {LEVELS.map((l, i) => (
        <motion.div className="card" key={l.n} style={{ background: l.c }} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: .1 + i * .08 }} whileHover={{ y: -3 }}>
          <div className="row" style={{ marginBottom: 10 }}><h3 style={{ margin: 0 }}>Niveau {l.n}</h3><Icon3D name="meditation" size={44} float delay={i * .3} /></div>
          <iframe title={`Niveau ${l.n}`} loading="lazy" src={`https://www.youtube-nocookie.com/embed/${l.id}?playsinline=1&rel=0`}
            allow="accelerometer; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
        </motion.div>
      ))}
    </div>
  )
}
