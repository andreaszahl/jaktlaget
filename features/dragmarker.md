# Feature: Draggable Markers with CSV Persistence

## Overview
Make all map markers draggable so hunt planners can adjust positions directly on the map. When a marker is dropped in a new location, the updated coordinates are saved back to the source CSV file via a local Express.js backend. No manual file editing required.

## Architecture

```
Leaflet frontend  →  fetch() POST  →  Express backend  →  writes to CSV
```

- **Frontend:** Leaflet map with draggable markers
- **Backend:** Minimal Express.js server running locally
- **Storage:** Same CSV file used as the original data source

## CSV Format
The existing CSV file has the following structure (adjust if different):
```
id,name,lat,lon
1,Post 1,59.9139,10.7522
2,Post 2,59.9200,10.7600
```

## Implementation Tasks

### 1. Express.js Backend (`server.js`)
- Create a `server.js` file in the project root
- Serve the frontend static files (HTML, JS, CSS) from a `public/` folder
- Expose two endpoints:
  - `GET /api/markers` — reads the CSV file and returns all markers as JSON
  - `POST /api/markers/:id` — receives `{ lat, lon }` in the request body and updates the matching row in the CSV file by `id`
- Use the `csv-parse` and `csv-stringify` packages to read and write the CSV file safely
- Preserve all existing columns and rows — only update `lat` and `lon` for the matching `id`
- Run on `http://localhost:3000`

### 2. Frontend — Load Markers from API
- Replace any hardcoded CSV loading with a `fetch('/api/markers')` call on map init
- Parse the returned JSON and create a Leaflet marker for each entry
- Each marker should display a popup or tooltip showing `name` and current coordinates

### 3. Frontend — Draggable Markers
- Set `draggable: true` on all markers
- On the `dragend` event for each marker:
  - Read the new coordinates from `marker.getLatLng()`
  - Send a `POST /api/markers/:id` request with the updated `lat` and `lon`
  - Show a brief visual confirmation (e.g. popup text "Saved" or a subtle toast notification)
  - Update the marker's popup/tooltip to reflect the new coordinates

### 4. Undo Last Move (optional but recommended)
- Keep an in-memory record of the previous position when a drag starts (`dragstart` event)
- Add an "Undo" button or keyboard shortcut (Ctrl+Z) that:
  - Moves the marker back to its previous position
  - Sends a POST to update the CSV with the original coordinates

### 5. npm Scripts
- Add the following to `package.json`:
  ```json
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
  ```
- Install required dependencies:
  ```bash
  npm install express csv-parse csv-stringify
  npm install --save-dev nodemon
  ```

## File Structure
```
jaktlaget/
├── public/
│   ├── index.html
│   ├── map.js
│   └── style.css
├── data/
│   └── markers.csv
├── server.js
└── package.json
```

## Acceptance Criteria
- [ ] All markers are draggable on the map
- [ ] Dropping a marker triggers a POST request with new coordinates
- [ ] CSV file is updated correctly after each drag — no data loss on other rows
- [ ] Marker popup/tooltip reflects updated coordinates after drop
- [ ] Visual confirmation is shown when save is successful
- [ ] Error is shown if the save request fails (e.g. server not running)
- [ ] `npm start` launches the app and serves the frontend

## Notes
- The Express server must be running locally for saves to work — document this clearly in the README
- Do not use `fs.writeFileSync` directly on the CSV without parsing — always read → modify → write to avoid corrupting the file
- If the CSV file is in a different location than `data/markers.csv`, update the path in `server.js` accordingly
- For future deployment, the backend could be replaced with a database, but CSV is sufficient for local field planning use
