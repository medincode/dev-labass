import { motion } from 'framer-motion'
import Icon3D from '../components/Icon3D'
import TitleLogo from '../components/TitleLogo'
import { BADGES, XP_PER_LEVEL, useGame } from '../game'
import { NAME } from '../store'

export default function Rewards() {
  const g = useGame()
  const left = XP_PER_LEVEL - (g.xp % XP_PER_LEVEL)
  return (
    <div className="scroll">
      <TitleLogo name="rewards" alt="Récompenses" />
      <p className="sub">Le niveau de {NAME}</p>

      <motion.div className="hero glass center" style={{ '--t': 'var(--yel)' } as React.CSSProperties} initial={{ scale: .94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <Icon3D name="trophy" size={120} float />
        <div className="big" style={{ fontSize: 72 }}>Niv. {g.level}</div>
        <div className="xpbar wide"><motion.i initial={{ width: 0 }} animate={{ width: g.pct + '%' }} transition={{ duration: 1.1, ease: 'easeOut' }} /></div>
        <p className="mute" style={{ margin: '10px 0 0' }}>{g.xp} XP · encore {left} XP pour le niveau {g.level + 1}</p>
      </motion.div>

      <motion.div className="card glass" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: .08 }}>
        <div className="row"><h3>Quêtes du jour</h3><small className="mute">{g.quests.filter(q => q.done).length}/3</small></div>
        {g.quests.map(q => (
          <motion.div key={q.id} className={'quest' + (q.done ? ' done' : '')} layout whileHover={{ x: 4 }}>
            <Icon3D name={q.done ? 'check' : 'star'} size={30} animate={q.done ? { scale: [1, 1.4, 1], rotate: [0, 12, 0] } : undefined} />
            <span>{q.label}</span><b>+{q.xp} XP</b>
          </motion.div>
        ))}
        <small className="mute">Reviens demain, {NAME}, elles se renouvellent.</small>
      </motion.div>

      <motion.div className="card glass" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: .16 }}>
        <div className="row"><h3>Badges</h3><small className="mute">{Object.values(g.earned).filter(Boolean).length}/{BADGES.length}</small></div>
        <div className="bgrid">
          {BADGES.map(b => (
            <motion.div key={b.id} className={'badge2' + (g.earned[b.id] ? ' on' : '')} whileHover={{ y: -4, scale: 1.04 }}>
              <Icon3D name={b.icon} size={54} float={g.earned[b.id]} />
              <b>{b.name}</b><small>{b.desc}</small>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
