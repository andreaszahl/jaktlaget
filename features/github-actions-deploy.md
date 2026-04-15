# Feature: GitHub Actions Deployment with Secrets Injection

## Overview
Set up a GitHub Actions workflow that automatically deploys the app to GitHub Pages on every push to `main`. Supabase credentials are stored as GitHub Secrets and injected into the frontend at build time — so no sensitive values are ever hardcoded or committed to the repository.

## How It Works

```
Push to main
    ↓
GitHub Actions workflow triggers
    ↓
Workflow reads SUPABASE_URL and SUPABASE_ANON_KEY from GitHub Secrets
    ↓
Injects values into a generated config.js file
    ↓
Deploys all files (including generated config.js) to GitHub Pages
    ↓
Live app at https://andreaszahl.github.io/jaktlaget
```

## Prerequisites
- GitHub repository: `andreaszahl/jaktlaget`
- GitHub Pages enabled on the repo (Settings → Pages → Source: GitHub Actions)
- Two GitHub Secrets added to the repo (Settings → Secrets and variables → Actions → New repository secret):
  - `SUPABASE_URL` — the Supabase project URL
  - `SUPABASE_ANON_KEY` — the Supabase anon/publishable key

## Implementation Tasks

### 1. Config Module (`public/config.js`)
- This file is **generated at deploy time** by the GitHub Actions workflow — it should never be created or edited manually
- Add `public/config.js` to `.gitignore` so it is never committed
- The generated file will look like this:
  ```javascript
  window.APP_CONFIG = {
    SUPABASE_URL: "https://rhxiitdyqqxbdcfjbaol.supabase.co",
    SUPABASE_ANON_KEY: "injected-by-github-actions"
  };
  ```

### 2. Load Config in HTML (`public/index.html`)
- Add a `<script>` tag that loads `config.js` **before** any other scripts:
  ```html
  <script src="config.js"></script>
  ```
- This ensures `window.APP_CONFIG` is available when `supabaseClient.js` initializes

### 3. Update Supabase Client (`public/supabaseClient.js`)
- Read credentials from `window.APP_CONFIG` instead of hardcoded values or `import.meta.env`:
  ```javascript
  const supabase = createClient(
    window.APP_CONFIG.SUPABASE_URL,
    window.APP_CONFIG.SUPABASE_ANON_KEY
  )
  ```

### 4. Local Development Config (`public/config.local.js`)
- Create a `public/config.local.js` file for local development with real values:
  ```javascript
  window.APP_CONFIG = {
    SUPABASE_URL: "https://rhxiitdyqqxbdcfjbaol.supabase.co",
    SUPABASE_ANON_KEY: "your-anon-key-here"
  };
  ```
- Add `public/config.local.js` to `.gitignore` — never commit this file
- For local development, load `config.local.js` instead of `config.js` in `index.html`
- Document this in `README.md` so other developers know to create their own `config.local.js`

### 5. GitHub Actions Workflow (`.github/workflows/deploy.yml`)
Create the following workflow file:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Generate config.js from secrets
        run: |
          cat > public/config.js << EOF
          window.APP_CONFIG = {
            SUPABASE_URL: "${{ secrets.SUPABASE_URL }}",
            SUPABASE_ANON_KEY: "${{ secrets.SUPABASE_ANON_KEY }}"
          };
          EOF

      - name: Setup GitHub Pages
        uses: actions/configure-pages@v5

      - name: Upload static files
        uses: actions/upload-pages-artifact@v3
        with:
          path: public/

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 6. Update `.gitignore`
Add the following entries if not already present:
```
public/config.js
public/config.local.js
```

### 7. Update `README.md`
Add a section explaining:
- How to set up GitHub Secrets for deployment
- How to create `config.local.js` for local development
- That `config.js` is auto-generated and should never be committed

## File Structure After Implementation
```
jaktlaget/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── public/
│   ├── index.html          ← loads config.js before other scripts
│   ├── map.js
│   ├── supabaseClient.js   ← reads from window.APP_CONFIG
│   ├── style.css
│   └── config.js           ← generated at deploy time, in .gitignore
├── config.local.js         ← local dev only, in .gitignore
├── .gitignore
└── README.md
```

## Acceptance Criteria
- [ ] Pushing to `main` triggers the GitHub Actions workflow
- [ ] `config.js` is generated correctly with values from GitHub Secrets
- [ ] App loads and connects to Supabase on the deployed GitHub Pages URL
- [ ] No credentials appear anywhere in the repository or git history
- [ ] Local development works using `config.local.js`
- [ ] `README.md` documents the setup process for new developers

## Notes
- Go to your repo on GitHub → Settings → Pages and set the source to **GitHub Actions** before running the workflow for the first time
- After adding GitHub Secrets, the first deployment will happen automatically on the next push to `main`
- If the workflow fails, check the Actions tab in your GitHub repo for error logs
- The `concurrency` block in the workflow prevents two deployments from running simultaneously if you push twice quickly
