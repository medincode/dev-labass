import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'

/** Rend les modales dans `.app` (hors zone scrollable/transformée) pour qu'elles couvrent toujours l'écran. */
export default function Portal({ children }: { children: ReactNode }) {
  return createPortal(children, document.querySelector('.app') ?? document.body)
}
