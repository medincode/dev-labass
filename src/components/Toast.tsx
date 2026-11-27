import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Icon3D from './Icon3D'
import { NAME } from '../store'

type T = { id: number; xp: number; levelUp: number }
export default function Toast() {
  const [t, setT] = useState<T | null>(null)
  useEffect(() => {
    let id = 0, h: number
    const on = (e: Event) => {
      const d = (e as CustomEvent).detail; setT({ id: ++id, ...d })
      clearTimeout(h); h = window.setTimeout(() => setT(null), 2400)
    }
    window.addEventListener('xp', on); return () => window.removeEventListener('xp', on)
  }, [])
  return (
    <AnimatePresence>
      {t && (
        <motion.div key={t.id} className="toast" initial={{ y: -50, opacity: 0, scale: .8 }} animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -30, opacity: 0 }} transition={{ type: 'spring', stiffness: 420, damping: 18 }}>
          <Icon3D name={t.levelUp ? 'trophy' : 'star'} size={36} animate={{ rotate: [0, 18, -18, 0], scale: [1, 1.25, 1] }} transition={{ duration: .7 }} />
          <div><b>{t.levelUp ? `Niveau ${t.levelUp} !` : `+${t.xp} XP`}</b><small>{t.levelUp ? `Trop fort ${NAME} !` : `Bien joué ${NAME}`}</small></div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
