# Feature: statistikk.html Design Update

## Overview
Redesign `statistikk.html` to match the design language of `index.html` and `login.html`. Replace the old sidebar with the updated design. Add the same header bar as `index.html`. Ensure the auth guard is in place so unauthenticated users are redirected to `login.html`. Data continues to be fetched from the Supabase `fellinger` table.

## Design Tokens (same as index.html and login.html)
- Primary color: `#2a3a2e`
- Accent color: `#a8c090`
- Sidebar background: `#f5f3ee`
- Sidebar border: `0.5px solid #d0cec8`
- Font: system sans-serif
- Border radius: `6px` for items, `8px` for inputs/buttons

## Page Layout
```
┌─────────────────────────────────────────────┐
│  Header bar (full width, #2a3a2e)            │
├──────────────┬──────────────────────────────┤
│              │                              │
│   Sidebar    │    Content area              │
│   (190px)    │    (flex: 1, white bg)       │
│              │                              │
└──────────────┴──────────────────────────────┘
```
- `body`: `margin: 0`, `display: flex`, `flex-direction: column`, `height: 100vh`
- Below header: `display: flex`, `flex: 1`, `overflow: hidden`
- Content area: `flex: 1`, `overflow-y: auto`, `padding: 1.5rem`, `background: var(--color-background-primary)`

## Header Bar
Identical to `index.html`. Copy the exact same header HTML and logic:
- Left: circular icon + "Jaktlaget" in `#ffffff`
- Right: "Hei, [user email]" in `#a8c090` + logout button
- Fetch user email from Supabase session:
  ```javascript
  const { data: { session } } = await supabase.auth.getSession()
  document.getElementById('user-greeting').textContent = 'Hei, ' + (session?.user?.email ?? '')
  ```
- Logout button signs out and redirects to `login.html`

## Auth Guard
- Load `auth.js` before page initialisation
- Call `await requireAuth()` as the first thing in the page init function
- If no valid session exists, redirect to `login.html`

## Sidebar
Identical structure to `index.html` sidebar, but with "Statistikk" as the active item:

### Section: Navigasjon
- Section label: **"Navigasjon"** — `font-size: 11px`, `font-weight: 500`, `color: #2a3a2e`, `text-transform: uppercase`, `letter-spacing: 0.05em`, `margin-bottom: 8px`
- Two navigation items:
  1. **"Jaktplanlegging"** — inactive: `background: transparent`, `color: #3a4e3e`
     - On click: `window.location.href = 'index.html'`
     - Hover: `background: rgba(42,58,46,0.08)`
  2. **"Statistikk"** — active (current page): `background: #2a3a2e`, `color: #ffffff`
- Both items: `padding: 7px 10px`, `border-radius: 6px`, `font-size: 13px`, `cursor: pointer`

### Footer label
- At the bottom, below `border-top: 0.5px solid #d0cec8`
- Text: **"Sund Jaktfelt"** — `font-size: 11px`, `color: #888`, `padding-top: 10px`

## Content Area

### Page title
- **"Fellinger"** — `font-size: 18px`, `font-weight: 500`, `color: #2a3a2e`, `margin-bottom: 1.25rem`

### Data table
Fetch all rows from the `fellinger` table in Supabase:
```javascript
const { data, error } = await supabase.from('fellinger').select('*')
```

Table structure:
- `width: 100%`, `border-collapse: collapse`, `font-size: 13px`
- Header row: `border-bottom: 0.5px solid #d0cec8`
- Header cells: `font-size: 11px`, `font-weight: 500`, `color: #2a3a2e`, `text-transform: uppercase`, `letter-spacing: 0.05em`, `padding: 8px 12px`, `text-align: left`
- Data rows: alternating background — odd rows `#ffffff`, even rows `#fafaf8`
- Row separator: `border-bottom: 0.5px solid #ece9e3`
- Cell padding: `8px 12px`

Columns in this order:
| Column header | Supabase field |
|---|---|
| Dyretype | `dyretype` |
| Sted | `sted` |
| Jeger | `jeger` |
| År | `ar` (or the actual field name in the table) |

### Loading and error states
- While fetching: show **"Laster inn data…"** in `font-size: 14px`, `color: #888` below the title
- On error: show **"Kunne ikke laste inn data. Prøv igjen."** in `color: #c0392b`
- Replace loading/error message with the table once data is returned

## Script loading order
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js"></script>
<script src="config.js"></script>
<script src="supabaseClient.js"></script>
<script src="auth.js"></script>
<script>/* page init and table rendering logic */</script>
```

## Also update index.html sidebar
Update the navigation label in `index.html` sidebar from **"Jaktboka"** to **"Jaktplanlegging"** to match.

## Acceptance Criteria
- [ ] Header bar matches `index.html` exactly — same colors, same greeting, same logout behavior
- [ ] Unauthenticated users are redirected to `login.html`
- [ ] Sidebar shows "Jaktplanlegging" (link to index.html) and "Statistikk" (active)
- [ ] Table displays all rows from the `fellinger` Supabase table
- [ ] Columns shown are Dyretype, Sted, Jeger, År in that order
- [ ] Loading state shown while data is fetching
- [ ] Error state shown if Supabase request fails
- [ ] "Jaktboka" label in `index.html` sidebar is updated to "Jaktplanlegging"
- [ ] Page works correctly on GitHub Pages
