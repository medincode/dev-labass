import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import AnimatedNumber from '../components/AnimatedNumber'
import Confirm from '../components/Confirm'
import { Close } from '../components/Glyph'
import Icon3D from '../components/Icon3D'
import NavIcon from '../components/NavIcons'
import TitleLogo from '../components/TitleLogo'
import { DAY, NAME, daysSince, newCounter, useLocal, type Counter as C } from '../store'

type Props = { id: string; title: string; sub: string; bg: string; illus: string }

const coach = (d: number) => d === 0 ? `Nouveau départ, ${NAME}. Chaque jour compte.` : d < 7 ? `Continue comme ça ${NAME}, tu construis ton streak !`
  : d < 30 ? `Régulier ${NAME} ! Tu es sur une belle lancée.` : `Mode légende activé, ${NAME}. Respect.`

export default function CounterPage({ id, title, sub, bg, illus }: Props) {
  const [c, setC] = useLocal<C>('counter-' + id, newCounter())
  const [ask, setAsk] = useState(false)
  const [askClear, setAskClear] = useState(false)
  const [, tick] = useState(0)
  useEffect(() => { const t = setInterval(() => tick(x => x + 1), 60000); return () => clearInterval(t) }, [])
  const days = daysSince(c)
  const hours = Math.floor(((Date.now() - c.start) % DAY) / 3600000)
  const lens = c.history.map(h => Math.floor((h.end - h.start) / DAY))
  const best = Math.max(days, ...lens, 0)
  const avg = lens.length ? Math.round(lens.reduce((a, b) => a + b, 0) / lens.length) : days
  const reset = () => {
    setC({ start: Date.now(), history: [...c.history, { start: c.start, end: Date.now() }] }); setAsk(false)
  }
  return (
    <div className="scroll">
      <TitleLogo name={id === 'fap' ? 'stayclean' : 'eatclean'} alt={title} />
      <p className="sub">{sub}</p>
      <motion.div className="hero glass center" style={{ '--t': bg } as React.CSSProperties} initial={{ scale: .94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <Icon3D name={illus} size={104} float />
        {days >= 7 && <Icon3D name="flame" size={44} float style={{ position: 'absolute', right: 18, top: 18 }} />}
        <div className="big"><AnimatedNumber value={days} /></div>
        <div>jour{days > 1 ? 's' : ''} · {hours}h depuis le dernier relapse</div>
        <p className="msg">{coach(days)}</p>
      </motion.div>
      <div className="row" style={{ gap: 10, marginBottom: 14 }}>
        {[[best, 'meilleur streak', 'trophy'], [c.history.length, 'relapses', 'heartbreak'], [avg, 'moy. jours', 'chart']].map(([v, l, ic]) => (
          <motion.div key={l} whileHover={{ y: -4, scale: 1.04 }} className="stat glass"><NavIcon name={ic as string} size={22} /><b>{v}</b><small>{l}</small></motion.div>
        ))}
      </div>
      <motion.button className="pill" whileHover={{ scale: 1.02 }} whileTap={{ scale: .95 }} style={{ width: '100%', padding: 16 }} onClick={() => setAsk(true)}>
        J'ai relapse · reset
      </motion.button>
      {c.history.length > 0 && (
        <div className="card glass" style={{ marginTop: 14 }}>
          <div className="row" style={{ marginBottom: 6 }}>
            <h3 style={{ margin: 0 }}>Ton historique</h3>
            <button className="more" onClick={() => setAskClear(true)}>Tout supprimer</button>
          </div>
          <AnimatePresence initial={false}>
            {c.history.map((h, idx) => ({ h, idx })).reverse().slice(0, 12).map(({ h, idx }) => (
              <motion.div key={h.start + '-' + h.end} className="row histrow" layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: 30, height: 0 }} transition={{ duration: .2 }}>
                <span>{new Date(h.start).toLocaleDateString('fr-FR')} → {new Date(h.end).toLocaleDateString('fr-FR')}</span>
                <span className="row" style={{ gap: 8 }}>
                  <b>{Math.floor((h.end - h.start) / DAY)} j</b>
                  <motion.button className="xbtn" aria-label="Supprimer cette ligne" whileTap={{ scale: .8 }}
                    onClick={() => setC({ ...c, history: c.history.filter((_, i) => i !== idx) })}><Close /></motion.button>
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      <Confirm open={askClear} title="Supprimer l'historique ?" text="Toutes les lignes seront effacées. Ton streak actuel n'est pas touché, mais les relapses, la moyenne et le meilleur streak repartent de zéro."
        icon="flame" confirm="Oui, supprimer" onConfirm={() => { setC({ ...c, history: [] }); setAskClear(false) }} onCancel={() => setAskClear(false)} />
      <Confirm open={ask} title={`Reset, ${NAME} ?`} text={`Tu repars à 0 et ton streak de ${days} jour${days > 1 ? 's' : ''} sera ajouté à l'historique.`}
        icon={illus} confirm="Oui, reset" onConfirm={reset} onCancel={() => setAsk(false)} />
    </div>
  )
}
