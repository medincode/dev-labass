import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { keepAwake } from '../keepAwake'
import NavIcon from './NavIcons'
import { useLocal } from '../store'

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
const I = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.4, strokeLinecap: 'round', strokeLinejoin: 'round' } as const
const Play = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" /></svg>
const Pause = () => <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4.5" height="14" rx="1.6" /><rect x="13.5" y="5" width="4.5" height="14" rx="1.6" /></svg>
const Vol = ({ off }: { off: boolean }) => <svg width="20" height="20" viewBox="0 0 24 24" {...I}><path d="M4 9.5v5h4l5 4v-13l-5 4z" />{off ? <path d="M17 9l4 6M21 9l-4 6" /> : <path d="M16.5 8.5a5 5 0 0 1 0 7" />}</svg>

/** Lecteur vidéo maison : overlay play, barre de progression, volume. Écran maintenu allumé pendant la lecture. */
export default function VideoPlayer({ src, onEnded, onStart }: { src: string; onEnded?: () => void; onStart?: () => void }) {
  const v = useRef<HTMLVideoElement>(null), box = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false), [t, setT] = useState(0), [dur, setDur] = useState(0)
  const [vol, setVol] = useState(1), [ui, setUi] = useState(true)
  const [mode, setMode] = useLocal<'video' | 'audio'>('player-mode', 'video')   // même élément <video> : le son continue en changeant de mode
  const audio = mode === 'audio'
  const hide = useRef<number>(0)
  const wake = () => { setUi(true); clearTimeout(hide.current); hide.current = window.setTimeout(() => v.current && !v.current.paused && setUi(false), 2500) }
  useEffect(() => () => { clearTimeout(hide.current); keepAwake(false) }, [])
  // Le wake lock web saute quand l'onglet passe en arrière-plan : on le reprend au retour si ça joue.
  useEffect(() => { const on = () => { if (!document.hidden && v.current && !v.current.paused) keepAwake(true) }; document.addEventListener('visibilitychange', on); return () => document.removeEventListener('visibilitychange', on) }, [])
  const setVolume = (x: number) => { setVol(x); if (v.current) { v.current.volume = x; v.current.muted = x === 0 } }
  const lastVol = useRef(1)
  const toggle = () => { const e = v.current!; e.paused ? e.play() : e.pause(); wake() }
  const seek = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect(); const x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width))
    v.current!.currentTime = x * dur; setT(x * dur); wake()
  }
  return (
    <>
    <div className="vmode glass" role="tablist" aria-label="Mode de lecture">
      {(['video', 'audio'] as const).map(m => (
        <button key={m} role="tab" aria-selected={mode === m} className={mode === m ? 'on' : ''} onClick={() => setMode(m)}>
          {mode === m && <motion.i layoutId="vmodepill" className="pill-bg" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
          <NavIcon name={m} size={18} /><span>{m === 'video' ? 'Vidéo' : 'Audio'}</span>
        </button>
      ))}
    </div>
    <div ref={box} className={'vp' + (audio ? ' audio' : '')} onPointerMove={wake}>
      {audio && (
        <div className={'vp-wave' + (playing ? ' on' : '')} aria-hidden>
          {Array.from({ length: 24 }).map((_, i) => <i key={i} style={{ animationDelay: `${(i % 8) * .11}s`, height: 14 + ((i * 37) % 46) + '%' }} />)}
        </div>
      )}
      <video ref={v} src={src} preload="metadata" playsInline onClick={toggle}
        onPlay={() => { setPlaying(true); wake(); keepAwake(true); onStart?.() }} onPause={() => { setPlaying(false); setUi(true); keepAwake(false) }}
        onTimeUpdate={e => setT(e.currentTarget.currentTime)} onLoadedMetadata={e => setDur(e.currentTarget.duration)}
        onEnded={() => { setPlaying(false); keepAwake(false); onEnded?.() }} />
      <AnimatePresence>
        {!playing && (
          <motion.button className="vp-big glass" aria-label="Lecture" onClick={toggle} initial={{ scale: .6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.4, opacity: 0 }}
            whileHover={{ scale: 1.1 }} whileTap={{ scale: .9 }}><Play /></motion.button>
        )}
      </AnimatePresence>
      <motion.div className="vp-bar glass" animate={{ opacity: ui ? 1 : 0, y: ui ? 0 : 10 }} transition={{ duration: .25 }}>
        <button onClick={toggle} aria-label={playing ? 'Pause' : 'Lecture'}>{playing ? <Pause /> : <Play />}</button>
        <small>{fmt(t)}</small>
        <div className="vp-track" onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); seek(e) }} onPointerMove={e => e.buttons && seek(e)}>
          <i style={{ width: dur ? (t / dur) * 100 + '%' : 0 }}><b /></i>
        </div>
        <small>{fmt(dur)}</small>
        <button onClick={() => { if (vol > 0) { lastVol.current = vol; setVolume(0) } else setVolume(lastVol.current || 1) }} aria-label="Son"><Vol off={vol === 0} /></button>
        <input className="vp-vol" type="range" min={0} max={1} step={0.02} value={vol} aria-label="Volume" onChange={e => setVolume(+e.target.value)}
          style={{ '--v': vol * 100 + '%' } as React.CSSProperties} />
      </motion.div>
    </div>
    </>
  )
}