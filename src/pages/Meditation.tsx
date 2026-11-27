import { motion } from 'framer-motion'
import Icon3D from '../components/Icon3D'
import VideoPlayer from '../components/VideoPlayer'
import { award, useGame } from '../game'
import { NAME } from '../store'

const LEVELS = [
  { n: 1, c: '#cde6dd' },
  { n: 2, c: '#f1df88' },
  { n: 3, c: '#bcc0ff' },
]
export default function Meditation() {
  const g = useGame()
  return (
    <div className="scroll">
      <p className="eyebrow">Méditation · Breathing</p>
      <h1><b>Breath good</b> {NAME},<br />méthode Wim Hof</h1>
      {LEVELS.map((l, i) => (
        <motion.div className="card glass" key={l.n} style={{ '--t': l.c } as React.CSSProperties} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: .1 + i * .08 }} whileHover={{ y: -3 }}>
          <div className="row" style={{ marginBottom: 10 }}><h3 style={{ margin: 0 }}>Niveau {l.n}{g.awards['video:' + l.n] ? ' · terminé' : ''}</h3><Icon3D name="meditation" size={44} float delay={i * .3} /></div>
          <VideoPlayer src={`${import.meta.env.BASE_URL}videos/breathing-lvl${l.n}.mp4`} onEnded={() => { award('video:' + l.n, 25); award('breath:' + g.today, 20) }} />
        </motion.div>
      ))}
    </div>
  )
}
