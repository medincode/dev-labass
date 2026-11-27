import { Capacitor } from '@capacitor/core'

/** Empêche la mise en veille de l'écran pendant la lecture : plugin natif (APK) ou Screen Wake Lock (web). */
let lock: WakeLockSentinel | null = null
export async function keepAwake(on: boolean) {
  try {
    if (Capacitor.isNativePlatform()) {
      const { KeepAwake } = await import('@capacitor-community/keep-awake')
      await (on ? KeepAwake.keepAwake() : KeepAwake.allowSleep())
      return
    }
    if (on) { if (!lock && 'wakeLock' in navigator) { lock = await navigator.wakeLock.request('screen'); lock.addEventListener('release', () => { lock = null }) } }
    else { await lock?.release(); lock = null }
  } catch { /* non supporté : on ignore */ }
}
