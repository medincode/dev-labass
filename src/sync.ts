import { createClient } from '@supabase/supabase-js'
import { useSyncExternalStore } from 'react'
import { DEFAULT_SETTINGS, acts, newCounter, readLocal, writeLocal, type Counter, type Plan, type Settings } from './store'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
export const supabase = url && anon ? createClient(url, anon) : null
export const syncEnabled = !!supabase

export type SyncStatus = { state: 'off' | 'idle' | 'syncing' | 'error'; email?: string; msg?: string; last?: number }
let status: SyncStatus = { state: 'off' }
const subs = new Set<() => void>()
const set = (p: Partial<SyncStatus>) => { status = { ...status, ...p }; subs.forEach(f => f()) }
export const useSync = () => useSyncExternalStore(cb => { subs.add(cb); return () => { subs.delete(cb) } }, () => status)

const KEYS = ['counter-fap', 'counter-cheat', 'mood-log', 'fitness-plan', 'awards', 'prog-done', 'settings']
const touched = () => new Set<string>(JSON.parse(localStorage.getItem('sync-touched') || '[]'))
let uid: string | null = null

const must = <T>(r: { data: T; error: { message: string } | null }) => { if (r.error) throw new Error(r.error.message); return r.data }

async function push(key: string) {
  if (!supabase || !uid) return
  const v = readLocal<unknown>(key, null) as never
  if (v == null) return
  const user_id = uid
  if (key.startsWith('counter-')) {
    const c = v as Counter
    must(await supabase.from('labass_counters').upsert({ user_id, kind: key.slice(8), start_at: new Date(c.start).toISOString(), history: c.history }, { onConflict: 'user_id,kind' }))
  } else if (key === 'mood-log') {
    const rows = Object.entries(v as Record<string, string>).map(([day, mood]) => ({ user_id, day, mood }))
    if (rows.length) must(await supabase.from('labass_moods').upsert(rows, { onConflict: 'user_id,day' }))
  } else if (key === 'fitness-plan') {
    const plan = v as Plan
    const rows = Object.keys(plan).map(day => ({ user_id, day, sports: acts(plan, day) })).filter(r => r.sports.length)
    if (rows.length) must(await supabase.from('labass_workouts').upsert(rows, { onConflict: 'user_id,day' }))
    const remote = must(await supabase.from('labass_workouts').select('day')) as { day: string }[]
    const keep = new Set(rows.map(r => r.day)), gone = remote.map(r => r.day).filter(d => !keep.has(d))
    if (gone.length) must(await supabase.from('labass_workouts').delete().in('day', gone))
  } else if (key === 'awards') {
    const rows = Object.entries(v as Record<string, number>).map(([k, xp]) => ({ user_id, key: k, xp }))
    if (rows.length) must(await supabase.from('labass_awards').upsert(rows, { onConflict: 'user_id,key' }))
  } else if (key === 'prog-done') {
    const rows = Object.entries(v as Record<string, string[]>).map(([k, done]) => { const i = k.indexOf(':'); return { user_id, day: k.slice(0, i), program: k.slice(i + 1), done } })
    if (rows.length) must(await supabase.from('labass_program_logs').upsert(rows, { onConflict: 'user_id,day,program' }))
  } else if (key === 'settings') {
    must(await supabase.from('labass_settings').upsert({ user_id, data: v }, { onConflict: 'user_id' }))
  }
}

async function pull() {
  if (!supabase) return
  const t = touched()
  const [c, m, w, a, p, s] = await Promise.all(['labass_counters', 'labass_moods', 'labass_workouts', 'labass_awards', 'labass_program_logs', 'labass_settings'].map(async tb => must(await supabase!.from(tb).select('*')) as Record<string, unknown>[]))
  // compteurs : le plus récent (start) gagne, historiques fusionnés
  for (const kind of ['fap', 'cheat']) {
    const key = 'counter-' + kind, r = c.find(x => x.kind === kind); if (!r) continue
    const remote: Counter = { start: Date.parse(r.start_at as string), history: r.history as Counter['history'] }
    const local = readLocal<Counter>(key, newCounter())
    if (!t.has(key)) { writeLocal(key, remote, true); continue }
    const hist = [...local.history, ...remote.history].filter((h, i, arr) => arr.findIndex(x => x.start === h.start && x.end === h.end) === i).sort((x, y) => x.start - y.start)
    writeLocal(key, { start: Math.max(local.start, remote.start), history: hist }, true)
  }
  const mergeMap = <T,>(key: string, remote: Record<string, T>, localWins: boolean) => {
    const local = readLocal<Record<string, T>>(key, {})
    writeLocal(key, t.has(key) ? (localWins ? local : { ...remote, ...local }) : { ...local, ...remote }, true)
  }
  if (m.length) mergeMap('mood-log', Object.fromEntries(m.map(r => [r.day as string, r.mood as string])), false)
  if (w.length && !t.has('fitness-plan')) writeLocal('fitness-plan', Object.fromEntries(w.map(r => [r.day as string, r.sports as string[]])) as Plan, true)
  if (a.length) mergeMap('awards', Object.fromEntries(a.map(r => [r.key as string, r.xp as number])), false)
  if (p.length) mergeMap('prog-done', Object.fromEntries(p.map(r => [`${r.day}:${r.program}`, r.done as string[]])), false)
  if (s[0] && !t.has('settings')) writeLocal('settings', { ...DEFAULT_SETTINGS, ...(s[0].data as Partial<Settings>) }, true)
}

export async function syncNow() {
  if (!supabase || !uid) return
  set({ state: 'syncing', msg: undefined })
  try { await pull(); for (const k of KEYS) await push(k); set({ state: 'idle', last: Date.now() }) }
  catch (e) { set({ state: 'error', msg: (e as Error).message }) }
}

const timers = new Map<string, number>()
if (supabase) {
  window.addEventListener('local-write', e => {
    const key = (e as CustomEvent<string>).detail
    if (!uid || !KEYS.includes(key)) return
    clearTimeout(timers.get(key))
    timers.set(key, window.setTimeout(() => { push(key).then(() => set({ state: 'idle', last: Date.now() }), err => set({ state: 'error', msg: err.message })) }, 1200))
  })
  const adopt = (session: { user: { id: string; email?: string } } | null) => {
    uid = session?.user.id ?? null
    if (uid) { set({ state: 'idle', email: session!.user.email }); syncNow() } else set({ state: 'off', email: undefined })
  }
  supabase.auth.getSession().then(({ data }) => adopt(data.session))
  supabase.auth.onAuthStateChange((_e, session) => { if ((session?.user.id ?? null) !== uid) adopt(session) })
}

export const signIn = async (email: string, password: string) => (await supabase!.auth.signInWithPassword({ email, password })).error?.message
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase!.auth.signUp({ email, password })
  return error?.message ?? (data.session ? undefined : 'Compte créé : confirme ton email puis connecte-toi.')
}
export const signOut = () => supabase!.auth.signOut()
