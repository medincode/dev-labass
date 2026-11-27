import { createRoot } from 'react-dom/client'
import '@fontsource/outfit/300.css'
import '@fontsource/outfit/400.css'
import '@fontsource/outfit/600.css'
import '@fontsource/fredoka/500.css'
import '@fontsource/fredoka/600.css'
import '@fontsource/fredoka/700.css'
import '@fontsource/italiana/400.css'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(<App />)

// Pause les animations CSS quand l'app est en arrière-plan (économise le GPU/batterie).
document.addEventListener('visibilitychange', () => document.documentElement.classList.toggle('bg-paused', document.hidden))
