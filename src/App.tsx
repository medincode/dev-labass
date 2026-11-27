import { AnimatePresence, motion } from 'framer-motion'
import { lazy, Suspense, useState } from 'react'
import Home, { type Route } from './pages/Home'
import Icon3D from './components/Icon3D'
import Toast from './components/Toast'

const CounterPage = lazy(() => import('./pages/Counter'))
const Fitness = lazy(() => import('./pages/Fitness'))
const Meditation = lazy(() => import('./pages/Meditation'))

const NAV: { r: Route; i: string }[] = [{ r: 'home', i: 'home' }, { r: 'fitness', i: 'fitness' }, { r: 'meditation', i: 'meditation' }]

export default function App() {
  const [r, setR] = useState<Route>('home')
  const back = () => setR('home')
  const page = {
    home: <Home go={setR} />,
    fap: <CounterPage id="fap" title="Stay Clean" sub="Jours sans relapse" bg="var(--lav)" illus="nofap" onBack={back} />,
    cheat: <CounterPage id="cheat" title="Eat Clean" sub="Jours sans cheat meal" bg="var(--yel)" illus="cheat" onBack={back} />,
    fitness: <Fitness onBack={back} />,
    meditation: <Meditation onBack={back} />,
  }[r]
  return (
    <div className="app">
      <div className="blobs" aria-hidden><i /><i /><i /></div>
      <Toast />
      <AnimatePresence mode="wait">
        <motion.div key={r} style={{ height: '100%' }} initial={{ opacity: 0, x: 30, scale: .98 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: .22 }}>
          <Suspense fallback={null}>{page}</Suspense>
        </motion.div>
      </AnimatePresence>
      <motion.nav className="nav" initial={{ y: 90 }} animate={{ y: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 18, delay: .3 }}>
        {NAV.map(n => (
          <motion.button key={n.r} className={r === n.r ? 'on' : ''} onClick={() => setR(n.r)} whileHover={{ y: -4, scale: 1.1 }} whileTap={{ scale: .85 }} layout aria-label={n.r}>
            <Icon3D name={n.i} size={r === n.r ? 40 : 32} />
          </motion.button>
        ))}
      </motion.nav>
    </div>
  )
}
