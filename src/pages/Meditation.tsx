import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import Icon3D from '../components/Icon3D'
import TitleLogo from '../components/TitleLogo'
import VideoPlayer from '../components/VideoPlayer'
import { award, useGame } from '../game'
import { NAME } from '../store'

const LEVELS = [
  { n: 1, c: '#b9e6d6', label: 'Niveau 1', sub: 'Débutant' },
  { n: 2, c: '#f6e07c', label: 'Niveau 2', sub: 'Intermédiaire' },
  { n: 3, c: '#b9bdff', label: 'Niveau 3', sub: 'Avancé' },
]
export default function Meditation() {
  const g = useGame()
  const [lvl, setLvl] = useState(1)
  const cur = LEVELS[lvl - 1]
  return (
    <div className="scroll">
      <TitleLogo name="breathgood" alt="Breath good" />
      <p className="sub">{NAME}, méthode Wim Hof</p>
      <div className="tabs glass" role="tablist">
        {LEVELS.map(l => (
          <motion.button key={l.n} role="tab" aria-selected={lvl === l.n} className={lvl === l.n ? 'on' : ''} onClick={() => setLvl(l.n)} whileTap={{ scale: .92 }}>
            {lvl === l.n && <motion.i layoutId="tabpill" className="pill-bg" style={{ background: l.c }} transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
            <Icon3D name={'lvl' + l.n} size={lvl === l.n ? 46 : 38} animate={{ y: lvl === l.n ? -2 : 0 }} />
            <span>{l.label}</span>
            {g.awards['video:' + l.n] && <Icon3D name="check" size={18} className="tick" />}
          </motion.button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div className="card glass" key={lvl} style={{ '--t': cur.c } as React.CSSProperties}
          initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -40, opacity: 0 }} transition={{ duration: .22 }}>
          <div className="row" style={{ marginBottom: 12 }}>
            <div><h3 style={{ margin: 0 }}>{cur.label}</h3><small className="mute">{cur.sub} · +25 XP à la fin</small></div>
            <Icon3D name={'lvl' + lvl} size={52} float />
          </div>
          <VideoPlayer src={`${import.meta.env.BASE_URL}videos/breathing-lvl${lvl}.mp4`}
            onEnded={() => { award('video:' + lvl, 25); award('breath:' + g.today, 20) }} />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
