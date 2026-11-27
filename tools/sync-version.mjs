// Source de vérité = package.json "version". Synchronise le projet Android (versionName/versionCode + nom de l'APK).
import { readFileSync, writeFileSync } from 'node:fs'
const { version } = JSON.parse(readFileSync('package.json', 'utf8'))
const [maj, min, pat] = version.split('.').map(Number)
const code = maj * 10000 + min * 100 + pat
const f = 'android/app/build.gradle'
let g = readFileSync(f, 'utf8')
g = g.replace(/versionCode \d+/, `versionCode ${code}`).replace(/versionName "[^"]*"/, `versionName "${version}"`)
if (!g.includes('labass-v')) {
  g = g.replace(/android \{/, `android {\n    applicationVariants.all { variant ->\n        variant.outputs.all { outputFileName = "labass-v\${variant.versionName}-\${variant.buildType.name}.apk" }\n    }`)
}
writeFileSync(f, g)
console.log(`Android → v${version} (code ${code})`)
