import { useEffect, useRef } from 'react'

/**
 * Orbite interactive : les éléments tournent autour du centre du conteneur.
 * Glisser = tourner (suit le doigt), relâcher = inertie, puis dérive lente qui continue.
 * Les positions sont écrites directement dans le DOM (transform) : aucun re-render React.
 */
export function useOrbit(base: number[], rx: number, ry: number, onSpin?: () => void) {
  const hub = useRef<HTMLDivElement>(null)
  const els = useRef<(HTMLElement | null)[]>([])
  const st = useRef({ theta: 0, omega: 0, idle: 0, drag: false, last: 0, lastT: 0, moved: 0 })

  const paint = () => base.forEach((b, i) => {
    const el = els.current[i]; if (!el) return
    const a = (b + st.current.theta) * Math.PI / 180
    el.style.transform = `translate3d(${Math.cos(a) * rx}px,${Math.sin(a) * ry}px,0)`
  })

  useEffect(() => {
    let raf = 0, t0 = performance.now(), skip = false
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop)
      // dérive lente : 30 images/s suffisent (moitié moins de travail), plein débit pendant le glisser
      if (!st.current.drag && Math.abs(st.current.omega) < 12 && (skip = !skip)) return
      const dt = Math.min(.05, (t - t0) / 1000); t0 = t
      const s = st.current
      if (!s.drag) {
        const idle = document.documentElement.classList.contains('reduce-motion') ? 0 : s.idle
        s.omega += (idle - s.omega) * (1 - Math.exp(-dt / 1.8))   // freine jusqu'à la vitesse de dérive
        if (Math.abs(s.omega) > .05) { s.theta += s.omega * dt; paint() }
      }
    }
    paint(); raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const angleOf = (e: React.PointerEvent) => {
    const r = hub.current!.getBoundingClientRect()
    // angle paramétrique de l'ellipse : le doigt reste collé à l'icône
    return Math.atan2((e.clientY - (r.top + r.height / 2)) / ry, (e.clientX - (r.left + r.width / 2)) / rx) * 180 / Math.PI
  }
  const bind = {
    onPointerDown: (e: React.PointerEvent) => {
      const s = st.current; s.drag = true; s.last = angleOf(e); s.lastT = performance.now(); s.moved = 0; s.omega = 0
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    },
    onPointerMove: (e: React.PointerEvent) => {
      const s = st.current; if (!s.drag) return
      const a = angleOf(e); let d = a - s.last
      if (d > 180) d -= 360; if (d < -180) d += 360
      const now = performance.now(), dt = Math.max(.001, (now - s.lastT) / 1000)
      s.last = a; s.lastT = now; s.theta += d; s.moved += Math.abs(d)
      s.omega = s.omega * .6 + (d / dt) * .4
      paint()
    },
    onPointerUp: () => {
      const s = st.current; if (!s.drag) return
      s.drag = false
      if (performance.now() - s.lastT > 90) s.omega = 0                // doigt arrêté avant de lâcher : pas d'élan
      s.omega = Math.max(-720, Math.min(720, s.omega))
      if (Math.abs(s.omega) > 40) { s.idle = Math.sign(s.omega) * 7; if (Math.abs(s.omega) > 160) onSpin?.() }
    },
  }
  return { hub, els, bind: { ...bind, onPointerCancel: bind.onPointerUp }, wasDrag: () => st.current.moved > 4 }
}
