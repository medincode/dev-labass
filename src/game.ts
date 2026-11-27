import { DAY, acts, daysSince, dkey, newCounter, readLocal, useLocal, writeLocal, type Counter, type Plan } from './store'

type Awards = Record<string, number>
export const XP_PER_LEVEL = 100

/** Donne des XP une seule fois par clé (ex: "mood:2026-11-27"). */
export function award(key: string, xp: number) {
  const a = readLocal<Awards>('awards', {})
  if (a[key]) return
  const before = totalXp(a)
  writeLocal('awards', { ...a, [key]: xp })
  const lvl = Math.floor((before + xp) / XP_PER_LEVEL) + 1
  window.dispatchEvent(new CustomEvent('xp', { detail: { xp, levelUp: lvl > Math.floor(before / XP_PER_LEVEL) + 1 ? lvl : 0 } }))
}
const totalXp = (a: Awards) => Object.values(a).reduce((s, v) => s + v, 0)

export const BADGES = [
  { id: 'first', name: 'Premier pas', desc: 'Logger ton mood', icon: 'star' },
  { id: 'week', name: 'Semaine de feu', desc: '7 jours de streak', icon: 'flame' },
  { id: 'month', name: 'Mois d\'acier', desc: '30 jours de streak', icon: 'trophy' },
  { id: 'sport', name: 'Sportif', desc: '10 séances planifiées', icon: 'medal' },
  { id: 'zen', name: 'Zen', desc: '5 séances de breathing', icon: 'meditation' },
] as const

export function useGame() {
  const [awards] = useLocal<Awards>('awards', {})
  const [fap] = useLocal<Counter>('counter-fap', newCounter())
  const [cheat] = useLocal<Counter>('counter-cheat', newCounter())
  const [moods] = useLocal<Record<string, string>>('mood-log', {})
  const [plan] = useLocal<Plan>('fitness-plan', {})
  const streak = Math.max(daysSince(fap), daysSince(cheat))
  const xp = totalXp(awards) + (daysSince(fap) + daysSince(cheat)) * 5
  const breaths = Object.keys(awards).filter(k => k.startsWith('breath:')).length
  const earned: Record<string, boolean> = {
    first: Object.keys(moods).length > 0,
    week: streak >= 7,
    month: streak >= 30,
    sport: Object.keys(plan).reduce((n, k) => n + acts(plan, k).length, 0) >= 10,
    zen: breaths >= 5,
  }
  const today = dkey()
  return {
    xp, level: Math.floor(xp / XP_PER_LEVEL) + 1, pct: (xp % XP_PER_LEVEL) / XP_PER_LEVEL * 100,
    earned, awards, moods, plan, today, breaths,
    quests: [
      { id: 'mood', label: 'Logger ton mood', xp: 10, done: !!moods[today] },
      { id: 'fit', label: 'Planifier ta séance', xp: 15, done: acts(plan, today).length > 0 },
      { id: 'breath', label: 'Finir une vidéo breathing', xp: 20, done: !!awards['breath:' + today] },
    ],
  }
}
export { DAY }
