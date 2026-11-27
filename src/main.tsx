import { createRoot } from 'react-dom/client'
import '@fontsource/outfit/300.css'
import '@fontsource/outfit/400.css'
import '@fontsource/outfit/600.css'
import '@fontsource/fredoka/300.css'
import '@fontsource/fredoka/500.css'
import '@fontsource/fredoka/600.css'
import '@fontsource/fredoka/700.css'
import '@fontsource/dm-serif-display/400.css'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(<App />)

// Pause les animations CSS quand l'app est en arrière-plan (économise le GPU/batterie).
document.addEventListener('visibilitychange', () => document.documentElement.classList.toggle('bg-paused', document.hidden))

// Pendant un défilement, les animations décoratives en boucle sont mises en pause (le GPU ne fait que le scroll),
// puis reprennent 150 ms après le dernier mouvement. Aucun changement visuel au repos.
{
  const h = document.documentElement; let t = 0, on = false
  document.addEventListener('scroll', e => {
    if ((e.target as HTMLElement)?.classList?.contains('strip') || (e.target as HTMLElement)?.classList?.contains('carousel')) return
    if (!on) { on = true; h.classList.add('scrolling') }
    clearTimeout(t); t = window.setTimeout(() => { on = false; h.classList.remove('scrolling') }, 150)
  }, { capture: true, passive: true })
}

// Splash : logo Labass affiché au démarrage, fondu une fois l'app prête (≥ 900 ms pour qu'il soit lisible).
{
  const el = document.getElementById('splash'), t0 = performance.now()
  const hide = () => setTimeout(() => { if (!el) return; el.style.opacity = '0'; el.style.pointerEvents = 'none'; setTimeout(() => el.remove(), 500) }, Math.max(0, 900 - (performance.now() - t0)))
  document.readyState === 'complete' ? hide() : window.addEventListener('load', hide, { once: true })
}
