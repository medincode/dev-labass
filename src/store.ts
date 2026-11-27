import { useCallback, useSyncExternalStore } from 'react'

// Mini-store partagé par clé : plusieurs composants voient la même valeur localStorage.
const cache = new Map<string, unknown>()
const subs = new Map<string, Set<() => void>>()
const persist = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* ignore */ } }

export function readLocal<T>(key: string, init: T): T {
  if (!cache.has(key)) {
    let v = init
    try { const s = localStorage.getItem(key); if (s) v = JSON.parse(s) as T; else persist(key, init) } catch { /* ignore */ }
    cache.set(key, v)
  }
  return cache.get(key) as T
}
/** `silent` = écriture venue de la synchro distante (ne déclenche pas de push). */
export function writeLocal<T>(key: string, next: T, silent = false) {
  cache.set(key, next); persist(key, next); subs.get(key)?.forEach(f => f())
  if (silent) return
  try { const t = new Set<string>(JSON.parse(localStorage.getItem('sync-touched') || '[]')); t.add(key); localStorage.setItem('sync-touched', JSON.stringify([...t])) } catch { /* ignore */ }
  window.dispatchEvent(new CustomEvent('local-write', { detail: key }))
}
export function useLocal<T>(key: string, init: T) {
  const v = useSyncExternalStore(
    cb => { let s = subs.get(key); if (!s) subs.set(key, (s = new Set())); s.add(cb); return () => { s!.delete(cb) } },
    () => readLocal(key, init),
  )
  const set = useCallback((n: T | ((p: T) => T)) => {
    writeLocal(key, typeof n === 'function' ? (n as (p: T) => T)(readLocal(key, init)) : n)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
  return [v, set] as const
}

export const DAY = 86400000
export const dkey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export type Counter = { start: number; history: { start: number; end: number }[] }
export const newCounter = (): Counter => ({ start: Date.now(), history: [] })
export const daysSince = (c: Counter) => Math.floor((Date.now() - c.start) / DAY)

export const MOODS = [
  { id: 'happy', label: 'Heureux', color: '#f1df88' },
  { id: 'calm', label: 'Calme', color: '#8d9b62' },
  { id: 'angry', label: 'Colère', color: '#e88e7e' },
  { id: 'excited', label: 'Excité', color: '#6f9be0' },
  { id: 'sad', label: 'Triste', color: '#efd9cf' },
  { id: 'stress', label: 'Stress', color: '#bcc0ff' },
] as const

export const SPORTS = [
  { id: 'surf', label: 'Surf', c: '#cde6dd' },
  { id: 'tennis', label: 'Tennis', c: '#f1df88' },
  { id: 'gym1', label: 'Gym full body V1', c: '#bcc0ff' },
  { id: 'gym2', label: 'Gym full body V2', c: '#f6c9bd' },
  { id: 'gym3', label: 'Gym full body V3', c: '#bcd8f5' },
  { id: 'cardio', label: 'Gym cardio', c: '#efd9cf' },
  { id: 'forest', label: 'Run forest', c: '#cde6dd' },
  { id: 'beach', label: 'Run & plouf beach', c: '#f1df88' },
  { id: 'stretch', label: 'Stretching', c: '#e3e6c9' },
  { id: 'ice', label: 'Ice bath', c: '#bcd8f5' },
] as const

export type Settings = { theme: 'auto' | 'light' | 'dark'; name: string; reduceMotion: boolean; blur: boolean }
export const DEFAULT_SETTINGS: Settings = { theme: 'auto', name: 'Mehdi', reduceMotion: false, blur: true }
const stored = (): Partial<Settings> => { try { return JSON.parse(localStorage.getItem('settings') || '{}') } catch { return {} } }
/** Prénom affiché partout (réglable dans Paramètres, lu au chargement). */
export const NAME = stored().name?.trim() || 'Mehdi'
export const hello = () => { const h = new Date().getHours(); return h < 5 ? 'Bonne nuit' : h < 12 ? 'Bonjour' : h < 18 ? 'Salut' : 'Bonsoir' }

/** Planning : plusieurs activités par jour (anciennes données = une seule chaîne). */
export type Plan = Record<string, string[] | string>
export const acts = (p: Plan, k: string): string[] => { const v = p[k]; return Array.isArray(v) ? v : v ? [v] : [] }
