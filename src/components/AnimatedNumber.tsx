import { animate, useMotionValue } from 'framer-motion'
import { useEffect, useState } from 'react'

/** Compteur qui défile (monte ou redescend à 0) à chaque changement de valeur. */
export default function AnimatedNumber({ value, duration = 1.1 }: { value: number; duration?: number }) {
  const mv = useMotionValue(value), [n, setN] = useState(value)
  useEffect(() => {
    const c = animate(mv, value, { duration, ease: [.2, .8, .2, 1] }); const u = mv.on('change', v => setN(Math.round(v)))
    return () => { c.stop(); u() }
  }, [value]) // eslint-disable-line react-hooks/exhaustive-deps
  return <>{n}</>
}
