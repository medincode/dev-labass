import sharp from 'sharp'
import { readdirSync, statSync, renameSync } from 'node:fs'
const dir = '/home/user/dev-labass/src/assets/3d'
const big = /^(nofap|cheat|flame|trophy|mood-.*)\.webp$/
let b = 0, a = 0
for (const f of readdirSync(dir).filter(f => f.endsWith('.webp'))) {
  const p = `${dir}/${f}`, s = big.test(f) ? 288 : 192
  b += statSync(p).size
  await sharp(p).resize(s, s, { fit: 'inside' }).webp({ lossless: true, effort: 6 }).toFile(p + '.tmp')
  renameSync(p + '.tmp', p); a += statSync(p).size
}
console.log((b / 1e6).toFixed(2) + 'MB → ' + (a / 1e6).toFixed(2) + 'MB')
