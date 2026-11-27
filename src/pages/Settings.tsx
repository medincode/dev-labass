import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Confirm from '../components/Confirm'
import NavIcon from '../components/NavIcons'
import { DEFAULT_SETTINGS, NAME, type Settings, readLocal, useLocal, writeLocal } from '../store'

const KEYS = ['counter-fap', 'counter-cheat', 'mood-log', 'fitness-plan', 'awards', 'prog-done', 'settings']
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
  const [ask, setAsk] = useState(false)
  const file = useRef<HTMLInputElement>(null)
  const set = (p: Partial<Settings>) => setSt({ ...st, ...p })
  const exportData = () => {
    const data: Record<string, unknown> = {}; KEYS.forEach(k => { data[k] = readLocal(k, null) })
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }))
    a.download = `labass-${new Date().toISOString().slice(0, 10)}.json`; a.click(); URL.revokeObjectURL(a.href)
  }
  const importData = async (f?: File) => {
    if (!f) return
    try { const d = JSON.parse(await f.text()); KEYS.forEach(k => { if (d[k] != null) writeLocal(k, d[k]) }); location.reload() } catch { alert('Fichier invalide') }
  }
  const wipe = () => { KEYS.forEach(k => localStorage.removeItem(k)); location.reload() }
  return (
    <div className="scroll">
      <h1><b>Paramètres</b></h1>
      <p className="sub">Réglages de {NAME}</p>

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

      <div className="card glass">
        <h3>Données</h3>
        <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
          <motion.button className="pill ghost" whileTap={{ scale: .93 }} onClick={exportData}>Exporter</motion.button>
          <motion.button className="pill ghost" whileTap={{ scale: .93 }} onClick={() => file.current?.click()}>Importer</motion.button>
          <motion.button className="pill danger" whileTap={{ scale: .93 }} onClick={() => setAsk(true)}>Tout effacer</motion.button>
        </div>
        <input ref={file} type="file" accept="application/json" hidden onChange={e => importData(e.target.files?.[0])} />
      </div>

      <p className="mute center" style={{ fontSize: 12 }}>Labass v{__APP_VERSION__}</p>
      <Confirm open={ask} title={`Tout effacer, ${NAME} ?`} text="Compteurs, moods, planning, XP : tout repart de zéro. Exporte d'abord si tu veux garder une copie." icon="flame" confirm="Oui, effacer" onConfirm={wipe} onCancel={() => setAsk(false)} />
    </div>
  )
}
