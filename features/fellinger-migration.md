# Feature: Migrate data.csv to Supabase (fellinger table)

## Overview
Migrate `public/data.csv` to a new Supabase table called `fellinger`. Update `statistikk.html` to fetch data directly from Supabase instead of reading the local CSV file.

## Step 1 — Inspect the CSV
Before doing anything else, read `public/data.csv` and identify:
- All column names and their data types
- Number of rows
- Any empty or inconsistent values that need handling

Use the column names and types found in the CSV to define the Supabase table schema.

## Step 2 — Create the Supabase Table
In the Supabase SQL editor, generate and run a `CREATE TABLE` statement based on the columns found in `data.csv`. The table must:
- Be named `fellinger`
- Use `id serial PRIMARY KEY` as the primary key
- Map CSV columns to appropriate Postgres types (text, integer, double precision, date, etc.)
- Enable Row Level Security:
  ```sql
  ALTER TABLE fellinger ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Public read" ON fellinger FOR SELECT USING (true);
  CREATE POLICY "Public insert" ON fellinger FOR INSERT WITH CHECK (true);
  CREATE POLICY "Public update" ON fellinger FOR UPDATE USING (true);
  ```
Print the full SQL to the terminal before running so it can be reviewed.

## Step 3 — Migration Script (`migrate-fellinger.js`)
Write a one-time migration script in the project root:
- Read and parse `public/data.csv`
- Insert all rows into the `fellinger` table using the Supabase JS client
- Read Supabase credentials from environment variables:
  ```javascript
  const SUPABASE_URL = process.env.SUPABASE_URL
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY
  ```
- Log success/failure per row
- Run with:
  ```powershell
  $env:SUPABASE_URL="https://rhxiitdyqqxbdcfjbaol.supabase.co"
  $env:SUPABASE_ANON_KEY="your-anon-key-here"
  node migrate-fellinger.js
  ```

## Step 4 — Update `statistikk.html`
- Remove any code that reads from `data.csv` (fetch, PapaParse, or similar)
- Load the Supabase client — add this script tag before other scripts:
  ```html
  <script src="config.js"></script>
  <script src="supabaseClient.js"></script>
  ```
- Fetch all rows from the `fellinger` table:
  ```javascript
  const { data, error } = await supabase.from('fellinger').select('*')
  ```
- Pass the returned `data` array to the existing table rendering logic
- Show a loading state while data is being fetched
- Show a clear error message if the Supabase request fails

## Step 5 — Cleanup
After confirming all data is correct in Supabase and `statistikk.html` displays correctly:
- Delete `migrate-fellinger.js`
- Delete `public/data.csv`
- Commit and push

## Acceptance Criteria
- [ ] `fellinger` table created in Supabase with correct columns and RLS enabled
- [ ] All rows from `data.csv` are present in the Supabase table
- [ ] `statistikk.html` displays the same data as before, now sourced from Supabase
- [ ] No reference to `data.csv` remains in any frontend file
- [ ] `migrate-fellinger.js` and `public/data.csv` deleted after successful migration
- [ ] No credentials hardcoded anywhere

## Notes
- Use the same `window.APP_CONFIG` pattern already established in `supabaseClient.js` — no new credential handling needed
- The GitHub Actions workflow will automatically handle credentials on deployment — no changes to `deploy.yml` are needed
- If `statistikk.html` uses a library like PapaParse to parse the CSV, that dependency can be removed after migration
