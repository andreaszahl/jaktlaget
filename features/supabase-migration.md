# Feature: Migrate from CSV/Express to Supabase

## Overview
Replace the local Express.js backend and CSV file with Supabase as the data layer. The Supabase JS client will communicate directly with the database from the frontend, eliminating the need for a local server. All marker CRUD operations (read, update) will go through the Supabase client.

## Architecture Change

**Before:**
```
Leaflet frontend  →  fetch() POST  →  Express server  →  CSV file
```

**After:**
```
Leaflet frontend  →  Supabase JS client  →  Supabase Postgres database
```

## Prerequisites
- Supabase project already created and `markers` table already set up
- Project URL: `https://rhxiitdyqqxbdcfjbaol.supabase.co`
- Anon key: stored in `.env` only — never hardcoded (see Environment Variables section)

## Database
Table `markers` is already created in the Supabase project with Row Level Security enabled.

## Data Migration
- Write a one-time migration script `migrate-csv.js` that:
  - Reads all rows from the existing `data/markers.csv`
  - Inserts each row into the Supabase `markers` table using the Supabase JS client
  - Logs success/failure for each row
  - Can be run once with `node migrate-csv.js` and then discarded

## Implementation Tasks

### 1. Install Supabase JS Client
```bash
npm install @supabase/supabase-js
```

### 2. Supabase Client Module (`public/supabaseClient.js`)
- Create a `supabaseClient.js` module that initializes and exports the Supabase client:
  ```javascript
  import { createClient } from '@supabase/supabase-js'
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  export default supabase
  ```
- The URL is known: `https://rhxiitdyqqxbdcfjbaol.supabase.co`
- Load `SUPABASE_ANON_KEY` from the `.env` file — never hardcode it

### 3. Replace Marker Loading (`map.js`)
- Remove the `fetch('/api/markers')` call
- Replace with a Supabase query:
  ```javascript
  const { data, error } = await supabase.from('markers').select('*')
  ```
- Use the returned `data` array to create Leaflet markers as before

### 4. Replace Marker Save on Drag (`map.js`)
- Remove the `fetch POST /api/markers/:id` call
- Replace with a Supabase update:
  ```javascript
  const { error } = await supabase
    .from('markers')
    .update({ lat, lon })
    .eq('id', markerId)
  ```
- Keep the existing visual confirmation (toast/popup) on success
- Show an error message if `error` is not null

### 5. Remove Express Backend
- Delete `server.js`
- Remove the following from `package.json`:
  - `express` dependency
  - `csv-parse` and `csv-stringify` dependencies
  - `nodemon` dev dependency
  - `start` and `dev` npm scripts
- The app now runs as a static frontend — serve with any static file server or open `index.html` directly

### 6. Environment Variables
- Create a `.env` file in the project root:
  ```
  SUPABASE_URL=https://rhxiitdyqqxbdcfjbaol.supabase.co
  SUPABASE_ANON_KEY=your-anon-key-here
  ```
- `.env` is already covered by `.gitignore` — never commit the actual key
- Document the required variables in `README.md` so others can configure their own instance

## File Structure After Migration
```
jaktlaget/
├── public/
│   ├── index.html
│   ├── map.js
│   ├── supabaseClient.js
│   └── style.css
├── migrate-csv.js        ← run once, then delete
├── .env                  ← not committed to Git
├── .gitignore
└── package.json
```

## Acceptance Criteria
- [ ] Markers load from Supabase on map init
- [ ] Dragging and dropping a marker updates the correct row in Supabase
- [ ] No Express server or CSV file required to run the app
- [ ] `migrate-csv.js` successfully imports all existing markers into Supabase
- [ ] `.env` is in `.gitignore` and credentials are never hardcoded
- [ ] Error states are handled if Supabase is unreachable

## Notes
- The `anon` key is safe to use in a frontend app as long as Row Level Security (RLS) is enabled — which is included in the SQL setup above
- If the app later needs user authentication (e.g. each hunting team manages their own markers), Supabase Auth integrates directly with RLS policies
- For offline use in the field, consider caching the marker data in `localStorage` as a fallback when Supabase is unreachable
