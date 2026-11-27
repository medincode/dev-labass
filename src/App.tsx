import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { lazy, Suspense, useEffect, useState } from 'react'
import { DEFAULT_SETTINGS, useLocal, type Settings } from './store'
import { Back } from './components/Glyph'
import Home, { type Route } from './pages/Home'
import NavIcon from './components/NavIcons'
import Toast from './components/Toast'

const CounterPage = lazy(() => import('./pages/Counter'))
const Fitness = lazy(() => import('./pages/Fitness'))
const Meditation = lazy(() => import('./pages/Meditation'))
const Mood = lazy(() => import('./pages/Mood'))
const Rewards = lazy(() => import('./pages/Rewards'))
const SettingsPage = lazy(() => import('./pages/Settings'))

const NAV: { r: Route; l: string; i: string }[] = [{ r: 'home', l: 'Accueil', i: 'home' }, { r: 'fap', l: 'Stay Clean', i: 'nofap' }, { r: 'cheat', l: 'Eat Clean', i: 'cheat' }, { r: 'fitness', l: 'Get fit', i: 'fitness' }, { r: 'meditation', l: 'Breath good', i: 'meditation' }]

const ROUTES: Route[] = ['home', 'fap', 'cheat', 'fitness', 'meditation', 'mood', 'rewards', 'settings']
const fromHash = (): Route => { const h = location.hash.replace(/^#\/?/, '') as Route; return ROUTES.includes(h) ? h : 'home' }

export default function App() {
  // La page courante vit dans l'URL (#/fitness) : elle survit au refresh et le bouton retour fonctionne.
  const [r, setRoute] = useState<Route>(fromHash)
  const setR = (n: Route) => { if (n !== r) location.hash = '/' + n }
  const goBack = () => { location.hash = '/home' }  // le retour ramène toujours à l'accueil
  useEffect(() => { const on = () => setRoute(fromHash()); window.addEventListener('hashchange', on); return () => window.removeEventListener('hashchange', on) }, [])
  const [st] = useLocal<Settings>('settings', DEFAULT_SETTINGS)
  useEffect(() => {
    const mq = matchMedia('(prefers-color-scheme: dark)')
    const apply = () => {
      const dark = st.theme === 'dark' || (st.theme === 'auto' && mq.matches), h = document.documentElement
      h.dataset.theme = dark ? 'dark' : 'light'
      h.classList.toggle('no-blur', !st.blur); h.classList.toggle('reduce-motion', st.reduceMotion)
      document.querySelector('meta[name=theme-color]')?.setAttribute('content', dark ? '#12101a' : '#f5f1f8')
    }
    apply(); mq.addEventListener('change', apply); return () => mq.removeEventListener('change', apply)
  }, [st])
  useEffect(() => { document.title = `Labass v${__APP_VERSION__}` }, [])
  const page = {
    home: <Home go={setR} />,
    fap: <CounterPage id="fap" title="Stay Clean" sub="Jours sans relapse" bg="var(--lav)" illus="nofap" />,
    cheat: <CounterPage id="cheat" title="Eat Clean" sub="Jours sans cheat meal" bg="var(--yel)" illus="cheat" />,
    fitness: <Fitness />,
    meditation: <Meditation />,
    mood: <Mood />,
    rewards: <Rewards />,
    settings: <SettingsPage />,
  }[r]
  const tab: Route = r === 'mood' || r === 'rewards' || r === 'settings' ? 'home' : r
  return (
    <MotionConfig reducedMotion={st.reduceMotion ? 'always' : 'user'}>
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
          <motion.button key={n.r} className={tab === n.r ? 'on' : ''} onClick={() => setR(n.r)} whileHover={{ y: -3 }} whileTap={{ scale: .85 }} aria-label={n.l} title={n.l}>
            {tab === n.r && <motion.i layoutId="pill" className="pill-bg" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
            <NavIcon name={n.r} />
          </motion.button>
        ))}
      </motion.nav>
    </div>
    </MotionConfig>
  )
}