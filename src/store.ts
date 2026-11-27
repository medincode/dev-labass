import { useEffect, useState } from 'react'

export function useLocal<T>(key: string, init: T) {
  const [v, setV] = useState<T>(() => {
    try { const s = localStorage.getItem(key); return s ? (JSON.parse(s) as T) : init } catch { return init }
  })
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)) } catch { /* ignore */ } }, [key, v])
  return [v, setV] as const
}

export const DAY = 86400000
export const dkey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export type Counter = { start: number; history: { start: number; end: number }[] }
export const newCounter = (): Counter => ({ start: Date.now(), history: [] })

export const MOODS = [
  { id: 'happy', label: 'Heureux', color: '#f1df88', mouth: 'M-8 4 Q0 12 8 4', eyes: 'o' },
  { id: 'calm', label: 'Calme', color: '#8d9b62', mouth: 'M-7 5 Q0 9 7 5', eyes: '-' },
  { id: 'angry', label: 'Colère', color: '#e88e7e', mouth: 'M-7 8 Q0 2 7 8', eyes: 'o' },
  { id: 'excited', label: 'Excité', color: '#6f9be0', mouth: 'M-9 3 Q0 14 9 3', eyes: 'o' },
  { id: 'sad', label: 'Triste', color: '#efd9cf', mouth: 'M-6 8 Q0 3 6 8', eyes: 'o' },
  { id: 'stress', label: 'Stress', color: '#bcc0ff', mouth: 'M-7 7 L7 7', eyes: 'o' },
] as const

export const SPORTS = [
  { id: 'surf', label: 'Surf', e: '🏄', c: '#cde6dd' },
  { id: 'tennis', label: 'Tennis', e: '🎾', c: '#f1df88' },
  { id: 'gym1', label: 'Gym full body V1', e: '🏋️', c: '#bcc0ff' },
  { id: 'gym2', label: 'Gym full body V2', e: '💪', c: '#bcc0ff' },
  { id: 'gym3', label: 'Gym full body V3', e: '🦾', c: '#bcc0ff' },
  { id: 'cardio', label: 'Gym cardio', e: '🚴', c: '#efd9cf' },
  { id: 'forest', label: 'Run forest', e: '🌲', c: '#cde6dd' },
  { id: 'beach', label: 'Run & plouf beach', e: '🏖️', c: '#f1df88' },
  { id: 'stretch', label: 'Stretching', e: '🧘', c: '#efd9cf' },
  { id: 'ice', label: 'Ice bath', e: '🧊', c: '#bcd8f5' },
] as const
