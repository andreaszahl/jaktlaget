# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A static Leaflet.js GIS web application for "Fellingskart Sund Jaktfelt" (a hunting field map in Sund, Nordland, Norway). No build system — all code lives in a single HTML file opened directly in a browser.

## Running the App

Open `index.html` directly in a browser. No server, build step, or npm install required.

## Architecture

Everything is in `index.html`:
- **Map**: Leaflet 1.7.1, centered at [65.24, 12.10], zoom 13
- **Basemap**: CARTO Light tile layer via CDN
- **Data loading**: jQuery 3.5.1 + PapaParse 5.3.0 are loaded (CDN) for CSV import — not yet implemented
- **Layer control**: `controlLayers` is referenced on line 43 but never initialized — this is a known bug

## Known Issues

- `controlLayers.addBaseLayer(light, ...)` on line 43 will throw a ReferenceError because `controlLayers` is never defined. To fix, initialize it with `L.control.layers()` before adding layers to it.
- jQuery and PapaParse are loaded but unused — they are placeholders for planned CSV data integration.
