
import { motion } from 'framer-motion'
import NavIcon from '../components/NavIcons'
import { DEFAULT_SETTINGS, type Settings, useLocal } from '../store'

const THEMES: { id: Settings['theme']; label: string; icon: string }[] = [{ id: 'light', label: 'Clair', icon: 'sun' }, { id: 'dark', label: 'Sombre', icon: 'moon' }, { id: 'auto', label: 'Auto', icon: 'auto' }]

function Switch({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button role="switch" aria-checked={on} aria-label={label} className={'sw' + (on ? ' on' : '')} onClick={() => onChange(!on)}>
      <motion.i animate={{ x: on ? 20 : 0 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
    </button>
  )
}

export default function SettingsPage() {
  const [st, setSt] = useLocal<Settings>('settings', DEFAULT_SETTINGS)
  const set = (p: Partial<Settings>) => setSt({ ...st, ...p })
  return (
    <div className="scroll">
      <h1><b>Paramètres</b></h1>
      <p className="sub">Tes réglages</p>

      <div className="card glass">
        <h3>Apparence</h3>
        <div className="seg">
          {THEMES.map(t => (
            <motion.button key={t.id} className={st.theme === t.id ? 'on' : ''} onClick={() => set({ theme: t.id })} whileTap={{ scale: .93 }}>
              {st.theme === t.id && <motion.i layoutId="themepill" className="pill-bg" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
              <NavIcon name={t.icon} size={22} /><span>{t.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="card glass">
        <h3>Performance</h3>
        <div className="setrow"><div><b>Animations réduites</b><small>Moins de mouvement, moins de batterie</small></div><Switch label="Animations réduites" on={st.reduceMotion} onChange={v => set({ reduceMotion: v })} /></div>
        <div className="setrow"><div><b>Effet verre (flou)</b><small>Désactive-le si ton téléphone chauffe</small></div><Switch label="Effet verre" on={st.blur} onChange={v => set({ blur: v })} /></div>
      </div>

      <p className="mute center" style={{ fontSize: 12 }}>Labass v{__APP_VERSION__}</p>
    </div>
  )
}
