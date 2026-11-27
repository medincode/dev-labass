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
| 🍌 | **Stay Clean** | Jours sans relapse qui montent tout seuls, reset quand le streak tombe, meilleur streak / moyenne / historique |
| 🍔 | **Eat Clean** | Même logique, pour la bouffe |
| 🏋️ | **Get fit** | Calendrier mensuel : tape un jour → choisis ton sport (Surf, Tennis, Gym full body V1/V2/V3, Gym cardio, Run forest, Run & plouf beach, Stretching, Ice bath) |
| 🧘 | **Breath good** | Respiration guidée animée + 3 niveaux de breathing Wim Hof en vidéo |

Toutes les données restent sur le téléphone (`localStorage`), aucun compte, aucun serveur.

## 🚀 Démarrage

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # build de prod dans dist/
```

## 🎬 Vidéos breathing

Les 3 niveaux Wim Hof sont intégrés par URL YouTube (lecteur embarqué, connexion internet requise) : [niveau 1](https://www.youtube.com/watch?v=tybOi4hjZFQ) · [niveau 2](https://www.youtube.com/watch?v=YkE8AObpzm4) · [niveau 3](https://www.youtube.com/watch?v=u8j7Ir_cg0M).

## ▲ Déploiement Vercel

`vercel.json` est prêt (Vite, rewrite SPA, cache immutable sur `/assets`). Push sur la branche → déploiement automatique.

## 🎮 Gamification

XP, niveaux, quêtes du jour (mood, séance, respiration) et 5 badges. Tout est calculé localement.

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

Les 29 icônes 3D (menus, sports, humeurs, badges) sont générées par `tools/gen-icons.sh` à partir de `tools/icons.tsv`, puis passées en WebP lossless par `node tools/optimize-images.mjs` (qui produit aussi favicon et icônes PWA). `node tools/android-icons.mjs` régénère les icônes launcher Android.

## 🗂️ Structure

```
src/
├─ pages/        Home · Counter · Fitness · Meditation
├─ components/   Illus (SVG) · Face (smileys)
├─ store.ts      localStorage, humeurs, sports
└─ index.css     palette pastel
android/         projet Capacitor
```

## 🎨 Palette

`#bcc0ff` lavande · `#f1df88` jaune · `#cde6dd` menthe · `#efd9cf` pêche · `#e88e7e` corail · `#8d9b62` olive · `#6f9be0` bleu
