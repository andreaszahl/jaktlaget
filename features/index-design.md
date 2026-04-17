# Feature: index.html Design Update

## Overview
Update `index.html` with a consistent design language matching `login.html`. Add a header bar across the top showing the logged-in user's name and a logout button. Update the existing sidebar to reflect the actual app structure — one map layer and two navigation links.

## Design Tokens (same as login.html)
- Primary color: `#2a3a2e` (dark forest green)
- Accent color: `#a8c090` (light sage green)
- Hover color: `#3a4e3e`
- Sidebar background: `#f5f3ee`
- Sidebar border: `0.5px solid #d0cec8`
- Font: system sans-serif, same as login.html
- Border radius for buttons and items: `6px`

## Page Layout
```
┌─────────────────────────────────────────────┐
│  Header bar (full width, #2a3a2e)            │
├──────────────┬──────────────────────────────┤
│              │                              │
│   Sidebar    │        Leaflet map           │
│   (190px)    │        (flex: 1)             │
│              │                              │
└──────────────┴──────────────────────────────┘
```
- `body` has `margin: 0`, `display: flex`, `flex-direction: column`, `height: 100vh`
- Map container takes `flex: 1` so the header pushes it down without JS

## Header Bar
- Full width, `background: #2a3a2e`, `padding: 10px 20px`
- `display: flex`, `align-items: center`, `justify-content: space-between`
- Height: approximately 48px

### Left side
- Small circular icon (`28px`, `background: rgba(255,255,255,0.1)`, `border-radius: 50%`)
- Inside: same SVG location pin as `login.html` (`#a8c090` teardrop, `#2a3a2e` inner circle)
- App name **"Jaktlaget"** — `font-size: 15px`, `font-weight: 500`, `color: #ffffff`

### Right side
- Greeting: **"Hei, [user email or name]"** — `font-size: 13px`, `color: #a8c090`
- Fetch the logged-in user's email from Supabase session:
  ```javascript
  const { data: { session } } = await supabase.auth.getSession()
  const userEmail = session?.user?.email ?? ''
  document.getElementById('user-greeting').textContent = 'Hei, ' + userEmail
  ```
- Logout button:
  - Label: **"Logg ut"**
  - Style: `background: rgba(255,255,255,0.08)`, `border: 0.5px solid rgba(255,255,255,0.2)`, `color: #ffffff`, `font-size: 12px`, `padding: 5px 12px`, `border-radius: 6px`
  - On click:
    ```javascript
    await supabase.auth.signOut()
    window.location.href = 'login.html'
    ```

## Sidebar
- Width: `190px`, fixed, `flex-shrink: 0`
- Background: `#f5f3ee`
- Border right: `0.5px solid #d0cec8`
- Padding: `1rem`
- `display: flex`, `flex-direction: column`, `justify-content: space-between`

### Section: Kartlag
- Section label: **"Kartlag"** — `font-size: 11px`, `font-weight: 500`, `color: #2a3a2e`, `text-transform: uppercase`, `letter-spacing: 0.05em`, `margin-bottom: 8px`
- One item: **"Kartverket terreng"** — always shown as active:
  - `padding: 7px 10px`, `background: #2a3a2e`, `border-radius: 6px`, `font-size: 13px`, `color: #ffffff`

### Section: Navigasjon
- Section label: **"Navigasjon"** — same style as "Kartlag" label, `margin-top: 1.25rem`, `margin-bottom: 8px`
- Two navigation items:
  1. **"Jaktboka"** — active state (current page): `background: #2a3a2e`, `color: #ffffff`
  2. **"Statistikk"** — inactive state: `background: transparent`, `color: #3a4e3e`
     - On click: `window.location.href = 'statistikk.html'`
     - Hover: `background: rgba(42,58,46,0.08)`
- Both items: `padding: 7px 10px`, `border-radius: 6px`, `font-size: 13px`, `cursor: pointer`

### Footer label
- At the bottom of the sidebar, below a `border-top: 0.5px solid #d0cec8`
- Text: **"Sund Jaktfelt"** — `font-size: 11px`, `color: #888`, `padding-top: 10px`

## Implementation Notes
- Do not change any Leaflet map logic, marker behavior, weather service, or Supabase queries
- Only update the HTML structure and CSS styling
- The map container must remain `id="map"` — Leaflet binds to this
- Ensure `map.invalidateSize()` is called after the layout is applied if the map renders incorrectly due to the new header height
- The header and sidebar styles should be in a `<style>` block in `index.html` — no external CSS file needed

## Acceptance Criteria
- [ ] Header bar is visible across the full width at the top of the page
- [ ] Logged-in user's email appears as "Hei, [email]" in the header
- [ ] Logout button signs the user out and redirects to `login.html`
- [ ] Sidebar shows "Kartverket terreng" as the only map layer
- [ ] Sidebar shows "Jaktboka" (active) and "Statistikk" (link) as navigation items
- [ ] "Sund Jaktfelt" label appears at the bottom of the sidebar
- [ ] Map fills the remaining space correctly with no layout issues
- [ ] Design matches the color scheme of `login.html`
