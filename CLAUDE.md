# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Leaflet.js GIS web application for "Fellingskart Sund Jaktfelt" — a hunting field map in Sund, Nordland, Norway. The frontend is static (no build step). A minimal Express server handles local development. Production is deployed to GitHub Pages via GitHub Actions.

## Running the App

**Local development:** Open `public/index.html` directly in a browser. No server or build step required. Ensure `public/config.js` exists with your Supabase credentials (gitignored — see Credentials section below).

**Production:** Deployed automatically to `https://andreaszahl.github.io/jaktlaget` on every push to `main` via `.github/workflows/deploy.yml`.

## Architecture

### Frontend (`public/`)
- **`index.html`** — map page: Leaflet 1.7.1, Kartverket Topo basemap, weather panel, sidebar navigation
- **`statistikk.html`** — statistics page: filterable table of kill data from `data.csv`
- **`weatherService.js`** — fetches Met.no Locationforecast 2.0 API, caches 5 minutes, converts wind degrees to compass/arrow
- **`supabaseClient.js`** — initializes Supabase JS client from `window.APP_CONFIG`

### Map layers
| Layer | Source | Notes |
|---|---|---|
| Kartverket Topo | WMTS tile layer | Default basemap |
| Poster | Supabase `markers` table | Draggable, numbered icons, saves on drop, Ctrl+Z undo |
| Fellinger | `public/data.csv` via PapaParse | Read-only, off by default in layer control |

### Credentials / config
- `public/config.local.js` — gitignored; sets `window.APP_CONFIG` for local dev
- `public/config.js` — gitignored; generated at deploy time by GitHub Actions from repository secrets
- `public/supabaseClient.js` — gitignored; reads from `window.APP_CONFIG`

### Deployment
`.github/workflows/deploy.yml` runs on push to `main`:
1. Generates `public/config.js` from `SUPABASE_URL` and `SUPABASE_ANON_KEY` GitHub Secrets
2. Deploys `public/` to GitHub Pages

## Key Files
```
├── .github/workflows/deploy.yml   ← GitHub Actions deploy workflow
├── features/                      ← feature specs (reference docs)
├── migrate-csv.js                 ← one-time Supabase migration script (delete after use)
├── public/
│   ├── index.html                 ← main map page
│   ├── statistikk.html            ← statistics page
│   ├── data.csv                   ← Fellinger kill data (read-only)
│   ├── supabaseClient.js          ← gitignored, fill in credentials
│   ├── config.local.js            ← gitignored, local dev APP_CONFIG
│   └── weatherService.js
└── package.json
```
