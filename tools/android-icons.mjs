// Génère les icônes launcher Android à partir de l'icône Labass (lossless → PNG niveau 9).
import sharp from 'sharp'
import { writeFileSync } from 'node:fs'
const src = 'src/assets/brand/app-icon-src.webp'
const res = 'android/app/src/main/res'
const D = { mdpi: 48, hdpi: 72, xhdpi: 96, xxhdpi: 144, xxxhdpi: 192 }
const png = { compressionLevel: 9, effort: 10 }
for (const [d, s] of Object.entries(D)) {
  const dir = `${res}/mipmap-${d}`, fg = Math.round(s * 108 / 48)
  await sharp(src).resize(s, s).png(png).toFile(`${dir}/ic_launcher.png`)
  const mask = Buffer.from(`<svg width="${s}" height="${s}"><circle cx="${s / 2}" cy="${s / 2}" r="${s / 2}"/></svg>`)
  await sharp(src).resize(s, s).composite([{ input: mask, blend: 'dest-in' }]).png(png).toFile(`${dir}/ic_launcher_round.png`)
  const inner = Math.round(fg * 0.8)
  await sharp({ create: { width: fg, height: fg, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: await sharp(src).resize(inner, inner).png().toBuffer(), gravity: 'center' }]).png(png).toFile(`${dir}/ic_launcher_foreground.png`)
}
writeFileSync(`${res}/values/ic_launcher_background.xml`, `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#EFE9F6</color>\n</resources>\n`)
console.log('android icons OK')
