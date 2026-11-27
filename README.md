<div align="center">

# 🌿 Labass

**Ton app santé perso : discipline, sport, respiration, mood.**
Mobile-first · pastel · illustrations « dessinées à la main » · prête à devenir un APK

![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-8d9b62?style=flat-square&logo=vite&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-animations-bcc0ff?style=flat-square)
![Capacitor](https://img.shields.io/badge/Capacitor-Android-6f9be0?style=flat-square)
![Offline](https://img.shields.io/badge/100%25-offline-e88e7e?style=flat-square)

</div>

---

## ✨ Fonctionnalités

| | Module | Ce que ça fait |
|---|---|---|
| 😊 | **Mood-o-meter** | 6 smileys sur l'accueil, stats par humeur + 7 derniers jours |
| 🔒 | **NoFap counter** | Jours sans relapse qui montent tout seuls, reset quand le streak tombe, meilleur streak / moyenne / historique |
| 🍔 | **Cheat meal counter** | Même logique, pour la bouffe |
| 🏋️ | **Fitness** | Calendrier mensuel : tape un jour → choisis ton sport (Surf, Tennis, Gym full body V1/V2/V3, Gym cardio, Run forest, Run & plouf beach, Stretching, Ice bath) |
| 🧘 | **Méditation** | Respiration guidée animée + 3 niveaux de breathing Wim Hof en vidéo |

Toutes les données restent sur le téléphone (`localStorage`), aucun compte, aucun serveur.

## 🚀 Démarrage

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # build de prod dans dist/
```

## 🎬 Vidéos breathing (compressées)

YouTube bloque les serveurs cloud : le téléchargement se fait **sur ton PC**.

```bash
pip install yt-dlp            # + ffmpeg installé
./scripts/download-videos.sh  # télécharge ET compresse (480p, CRF 30, faststart)
# si YouTube demande de prouver que tu n'es pas un robot :
COOKIES=firefox ./scripts/download-videos.sh
git add public/videos && git commit -m "vidéos breathing" && git push
```

Un mp4 déjà présent se recompresse avec `./scripts/compress-videos.sh`.
Tant que les fichiers sont absents, l'app affiche un bouton « Ouvrir sur YouTube ».

## 📱 Générer l'APK

**Option A : GitHub (zéro install)** → onglet *Actions* → **Build APK** → *Run workflow* → télécharge l'artifact `labass-apk`.

**Option B : en local** (Android Studio + JDK 21)

```bash
npm run apk
# → android/app/build/outputs/apk/debug/app-debug.apk
```

## 🎨 Illustrations avec imagegen

Le repo embarque le MCP [`codex-imagegen-mcp`](https://github.com/ShalomObongo/codex-imagegen-mcp) (`.mcp.json`) et son skill (`.claude/skills/imagegen-mcp`).
Il génère des images avec ton abonnement ChatGPT, sans clé API.

```bash
npx -y codex-imagegen-mcp login          # ou --device sur une machine sans navigateur
```

Les images générées vont dans `src/assets/illus/`. Style : trait noir fin imparfait, fond transparent, touches pastel.

## 🗂️ Structure

```
src/
├─ pages/        Home · Counter · Fitness · Meditation
├─ components/   Illus (SVG) · Face (smileys)
├─ store.ts      localStorage, humeurs, sports
└─ index.css     palette pastel
android/         projet Capacitor
scripts/         vidéos (download + compress)
```

## 🎨 Palette

`#bcc0ff` lavande · `#f1df88` jaune · `#cde6dd` menthe · `#efd9cf` pêche · `#e88e7e` corail · `#8d9b62` olive · `#6f9be0` bleu
