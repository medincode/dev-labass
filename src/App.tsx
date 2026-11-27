import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import Home, { type Route } from './pages/Home'
import CounterPage from './pages/Counter'
import Fitness from './pages/Fitness'
import Meditation from './pages/Meditation'

export default function App() {
  const [r, setR] = useState<Route>('home')
  const back = () => setR('home')
  const page = {
    home: <Home go={setR} />,
    fap: <CounterPage id="fap" title="NoFap" sub="Jours sans relapse" bg="var(--lav)" illus="head" onBack={back} />,
    cheat: <CounterPage id="cheat" title="Cheat meal" sub="Jours sans cheat meal" bg="var(--yel)" illus="burger" onBack={back} />,
    fitness: <Fitness onBack={back} />,
    meditation: <Meditation onBack={back} />,
  }[r]
  return (
    <div className="app">
      <AnimatePresence mode="wait">
        <motion.div key={r} style={{ height: '100%' }} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: .22 }}>
          {page}
        </motion.div>
      </AnimatePresence>
      <div className="nav">
        <button className={r === 'home' ? 'on' : ''} onClick={back}>⌂</button>
        <button className={r === 'fitness' ? 'on' : ''} onClick={() => setR('fitness')}>🏋️</button>
        <button className={r === 'meditation' ? 'on' : ''} onClick={() => setR('meditation')}>🧘</button>
      </div>
    </div>
  )
}
