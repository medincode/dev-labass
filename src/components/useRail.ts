import { useRef } from 'react'

/** Carousel horizontal : flèches précédent/suivant + swipe tactile (natif) + glisser à la souris. */
export function useRail(step = 216) {
  const ref = useRef<HTMLDivElement>(null)
  const d = useRef({ on: false, x: 0, left: 0, moved: false })
  const by = (dir: number) => ref.current?.scrollBy({ left: dir * step, behavior: 'smooth' })
  const end = () => { if (!d.current.on) return; d.current.on = false; if (ref.current) ref.current.style.scrollSnapType = '' }
  const bind = {
    onPointerDown: (e: React.PointerEvent) => {
      if (e.pointerType !== 'mouse' || !ref.current) return
      d.current = { on: true, x: e.clientX, left: ref.current.scrollLeft, moved: false }
    },
    onPointerMove: (e: React.PointerEvent) => {
      const s = d.current; if (!s.on || !ref.current) return
      const dx = e.clientX - s.x
      if (Math.abs(dx) > 5) { s.moved = true; ref.current.style.scrollSnapType = 'none' }
      if (s.moved) ref.current.scrollLeft = s.left - dx
    },
    onPointerUp: end, onPointerLeave: end,
  }
  return { ref, by, bind, moved: () => d.current.moved }
}
