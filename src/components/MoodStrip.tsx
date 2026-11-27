import { motion } from 'framer-motion'
import Icon3D from './Icon3D'
import { Arrow, Next, Prev } from './Glyph'
import { useRail } from './useRail'
import { award, useGame } from '../game'
import { MOODS, NAME, useLocal } from '../store'

/** Version compacte du mood-o-meter pour l'accueil : juste le slider d'humeurs. */
export default function MoodStrip({ onMore }: { onMore: () => void }) {
  const g = useGame()
  const [log, setLog] = useLocal<Record<string, string>>('mood-log', {})
  const rail = useRail(140)
  const cur = log[g.today]
  const pick = (id: string) => { if (rail.moved()) return; setLog({ ...log, [g.today]: id }); award('mood:' + g.today, 10) }
  return (
    <motion.div className="card glass" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
      <div className="row" style={{ marginBottom: 4 }}>
        <h3 style={{ margin: 0 }}>{cur ? `Ton mood, ${NAME}` : `Comment tu te sens, ${NAME} ?`}</h3>
        <button className="more" onClick={onMore}>Stats <Arrow /></button>
      </div>
      <div className="stripwrap">
        {rail.can && <button className="arr l glass" aria-label="Précédent" onClick={() => rail.by(-1)}><Prev /></button>}
        <div ref={rail.ref} className="strip" {...rail.bind}>
          {MOODS.map(m => (
            <motion.button key={m.id} className={'sm' + (cur === m.id ? ' on' : '')} onClick={() => pick(m.id)} whileHover={{ y: -4 }} whileTap={{ scale: .9 }}>
              <Icon3D name={'mood-' + m.id} size={46} float={cur === m.id} /><span>{m.label}</span>
            </motion.button>
          ))}
        </div>
        {rail.can && <button className="arr r glass" aria-label="Suivant" onClick={() => rail.by(1)}><Next /></button>}
      </div>
    </motion.div>
  )
}
