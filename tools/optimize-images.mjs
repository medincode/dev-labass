// Ré-encode toutes les images en lossless (WebP lossless / PNG niveau 9) + génère favicon, icônes PWA et Android.
import sharp from 'sharp'
import { readdirSync, mkdirSync, statSync, unlinkSync } from 'node:fs'
import { join } from 'node:path'

const ICON = 384 // les icônes 3D s'affichent à ≤ 128px (x3 densité) : 384px suffit
const dir = 'src/assets/3d'
let before = 0, after = 0
for (const f of readdirSync(dir).filter(f => f.endsWith('.png'))) {
  const src = join(dir, f); before += statSync(src).size
  const out = src.replace('.png', '.webp')
  await sharp(src).resize(ICON, ICON, { fit: 'inside' }).webp({ lossless: true, effort: 6 }).toFile(out)
  after += statSync(out).size; unlinkSync(src)
}
console.log(`3D icons: ${(before / 1e6).toFixed(1)}MB → ${(after / 1e6).toFixed(1)}MB`)

mkdirSync('public/icons', { recursive: true }); mkdirSync('src/assets/brand', { recursive: true })
const icon = 'src/assets/brand/app-icon-src.webp'
for (const [n, s] of [['favicon-32.png', 32], ['icon-192.png', 192], ['icon-512.png', 512], ['apple-touch-icon.png', 180]])
  await sharp(icon).resize(s, s).png({ compressionLevel: 9, effort: 10 }).toFile(`public/icons/${n}`)
await sharp(icon).webp({ lossless: true, effort: 6 }).toFile('src/assets/brand/app-icon.webp')
const logo = await sharp('src/assets/brand/logo-src.webp').trim({ threshold: 8 }).toBuffer()
await sharp(logo).resize({ width: 600 }).webp({ lossless: true, effort: 6 }).toFile('src/assets/brand/logo.webp')
await sharp('src/assets/brand/mascot.webp').toFile('/dev/null').catch(() => {})
for (const f of readdirSync('src/assets/brand').filter(f => /^title-.*\.png$/.test(f))) {
  const src = join('src/assets/brand', f)
  await sharp(await sharp(src).trim({ threshold: 8 }).toBuffer()).resize({ width: 560, withoutEnlargement: true }).webp({ lossless: true, effort: 6 }).toFile(src.replace('.png', '.webp'))
  unlinkSync(src)
}
console.log('brand OK')
