import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
const I = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.4, strokeLinecap: 'round', strokeLinejoin: 'round' } as const
const Play = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" /></svg>
const Pause = () => <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4.5" height="14" rx="1.6" /><rect x="13.5" y="5" width="4.5" height="14" rx="1.6" /></svg>
const Vol = ({ off }: { off: boolean }) => <svg width="20" height="20" viewBox="0 0 24 24" {...I}><path d="M4 9.5v5h4l5 4v-13l-5 4z" />{off ? <path d="M17 9l4 6M21 9l-4 6" /> : <path d="M16.5 8.5a5 5 0 0 1 0 7" />}</svg>
const Full = () => <svg width="20" height="20" viewBox="0 0 24 24" {...I}><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>

/** Lecteur vidéo maison : overlay play, barre de progression, volume, vitesse, plein écran. */
export default function VideoPlayer({ src, onEnded }: { src: string; onEnded?: () => void }) {
  const v = useRef<HTMLVideoElement>(null), box = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false), [t, setT] = useState(0), [dur, setDur] = useState(0)
  const [muted, setMuted] = useState(false), [rate, setRate] = useState(1), [ui, setUi] = useState(true)
  const hide = useRef<number>(0)
  const wake = () => { setUi(true); clearTimeout(hide.current); hide.current = window.setTimeout(() => v.current && !v.current.paused && setUi(false), 2500) }
  useEffect(() => () => clearTimeout(hide.current), [])
  const toggle = () => { const e = v.current!; e.paused ? e.play() : e.pause(); wake() }
  const seek = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect(); const x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width))
    v.current!.currentTime = x * dur; setT(x * dur); wake()
  }
  const speed = () => { const n = rate === 1 ? 1.25 : rate === 1.25 ? 1.5 : rate === 1.5 ? .75 : 1; v.current!.playbackRate = n; setRate(n) }
  const full = () => { const b = box.current!; document.fullscreenElement ? document.exitFullscreen() : (b.requestFullscreen?.() ?? v.current!.requestFullscreen?.()) }
  return (
    <div ref={box} className="vp" onPointerMove={wake}>
      <video ref={v} src={src} preload="metadata" playsInline muted={muted} onClick={toggle}
        onPlay={() => { setPlaying(true); wake() }} onPause={() => { setPlaying(false); setUi(true) }}
        onTimeUpdate={e => setT(e.currentTarget.currentTime)} onLoadedMetadata={e => setDur(e.currentTarget.duration)}
        onEnded={() => { setPlaying(false); onEnded?.() }} />
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
        <button className="vp-rate" onClick={speed}>{rate}x</button>
        <button onClick={() => setMuted(!muted)} aria-label="Son"><Vol off={muted} /></button>
        <button onClick={full} aria-label="Plein écran"><Full /></button>
      </motion.div>
    </div>
  )
}
