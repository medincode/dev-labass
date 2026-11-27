import { AnimatePresence, motion } from 'framer-motion'
import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Back } from './components/Glyph'
import Home, { type Route } from './pages/Home'
import Icon3D from './components/Icon3D'
import Toast from './components/Toast'

const CounterPage = lazy(() => import('./pages/Counter'))
const Fitness = lazy(() => import('./pages/Fitness'))
const Meditation = lazy(() => import('./pages/Meditation'))
const Mood = lazy(() => import('./pages/Mood'))
const Rewards = lazy(() => import('./pages/Rewards'))

const NAV: { r: Route; i: string; l: string }[] = [
  { r: 'home', i: 'home', l: 'Accueil' }, { r: 'fap', i: 'nofap', l: 'Clean' }, { r: 'cheat', i: 'cheat', l: 'Eat' },
  { r: 'fitness', i: 'fitness', l: 'Fit' }, { r: 'meditation', i: 'meditation', l: 'Breath' },
]

const ROUTES: Route[] = ['home', 'fap', 'cheat', 'fitness', 'meditation', 'mood', 'rewards']
const fromHash = (): Route => { const h = location.hash.replace(/^#\/?/, '') as Route; return ROUTES.includes(h) ? h : 'home' }

export default function App() {
  // La page courante vit dans l'URL (#/fitness) : elle survit au refresh et le bouton retour fonctionne.
  const [r, setRoute] = useState<Route>(fromHash)
  const setR = (n: Route) => { if (n !== r) location.hash = '/' + n }
  // Pile de navigation interne : le bouton retour revient à l'écran précédent (ou à l'accueil).
  const stack = useRef<Route[]>([r]), backing = useRef(false)
  useEffect(() => {
    if (backing.current) { backing.current = false; return }
    if (stack.current[stack.current.length - 1] !== r) stack.current.push(r)
  }, [r])
  const goBack = () => {
    stack.current.pop(); const prev = stack.current[stack.current.length - 1] ?? 'home'
    backing.current = true; location.hash = '/' + prev
  }
  useEffect(() => { const on = () => setRoute(fromHash()); window.addEventListener('hashchange', on); return () => window.removeEventListener('hashchange', on) }, [])
  useEffect(() => { document.title = `Labass v${__APP_VERSION__}` }, [])
  const page = {
    home: <Home go={setR} />,
    fap: <CounterPage id="fap" title="Stay Clean" sub="Jours sans relapse" bg="var(--lav)" illus="nofap" />,
    cheat: <CounterPage id="cheat" title="Eat Clean" sub="Jours sans cheat meal" bg="var(--yel)" illus="cheat" />,
    fitness: <Fitness />,
    meditation: <Meditation />,
    mood: <Mood />,
    rewards: <Rewards />,
  }[r]
  const tab: Route = r === 'mood' || r === 'rewards' ? 'home' : r
  return (
    <div className="app" data-home={r === 'home' ? '' : undefined}>
      <div className="blobs" aria-hidden><i /><i /><i /><i /></div>
      <Toast />
      <AnimatePresence>
        {r !== 'home' && (
          <motion.button key="back" className="backbtn glass" aria-label="Retour" onClick={goBack}
            initial={{ opacity: 0, x: -16, scale: .8 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: -16, scale: .8 }}
            whileHover={{ x: -3, scale: 1.06 }} whileTap={{ scale: .88 }}><Back /></motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        <motion.div key={r} style={{ height: '100%' }} initial={{ opacity: 0, y: 14, scale: .985 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .2 }}>
          <Suspense fallback={null}>{page}</Suspense>
        </motion.div>
      </AnimatePresence>
      <motion.nav className="nav glass" initial={{ y: 100 }} animate={{ y: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 18, delay: .25 }}>
        {NAV.map(n => (
          <motion.button key={n.r} className={tab === n.r ? 'on' : ''} onClick={() => setR(n.r)} whileHover={{ y: -3 }} whileTap={{ scale: .88 }} aria-label={n.l}>
            {tab === n.r && <motion.i layoutId="pill" className="pill-bg" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
            <Icon3D name={n.i} size={tab === n.r ? 36 : 30} animate={{ y: tab === n.r ? -2 : 0 }} /><span>{n.l}</span>
          </motion.button>
        ))}
      </motion.nav>
    </div>
  )
}
