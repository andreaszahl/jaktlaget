# Feature: Login Page Design

## Overview
Redesign `login.html` with a polished, map-themed visual. A full-page dark forest green background with a subtle topographic SVG overlay, and a clean white card centered on top containing the login form.

## Visual Design

### Page background
- Full-viewport background color: `#2a3a2e` (dark forest green)
- Overlay: an inline SVG covering the full background at low opacity (`0.18`) showing:
  - A grid of thin horizontal and vertical lines in `#a8c090`
  - Three organic contour lines (curved paths) in `#7aaa60`
  - Three small map marker dots (`#c8e0a0`) with short labels (P1, P2, P3)
- The SVG uses `position: absolute; inset: 0; width: 100%; height: 100%` with `preserveAspectRatio="xMidYMid slice"`

### Login card
- Centered horizontally and vertically on the page (`display: flex; align-items: center; justify-content: center` on the body)
- White background: `#ffffff`
- Border radius: `12px`
- Width: `360px` max, with `padding: 2rem 2.5rem`
- No border, no shadow

### Card header
- A circular icon (`44px`, background `#2a3a2e`, border-radius `50%`) centered at the top
- Inside the circle: a simple SVG location pin shape with a teardrop outline in `#a8c090` and a small inner circle in `#2a3a2e`
- App name: **"Jaktlaget"** — `22px`, `font-weight: 500`, color `#2a3a2e`, centered
- Subtitle: **"Logg inn for å fortsette"** — `13px`, color `#888`, centered
- Margin below header: `1.75rem`

### Form fields
Two fields, each with:
- Label above the input (`13px`, color `#555`)
- Input with `padding: 10px 12px`, `border: 0.5px solid #ccc`, `border-radius: 8px`, `font-size: 14px`, `background: #fafafa`
- Focus state: `border-color: #2a3a2e`, `outline: none`, `box-shadow: 0 0 0 3px rgba(42,58,46,0.12)`

Fields:
1. **E-post** — `type="email"`, placeholder `"navn@eksempel.no"`
2. **Passord** — `type="password"`, placeholder `"••••••••"`

### Login button
- Full width, `padding: 11px`
- Background: `#2a3a2e`, text: `#ffffff`
- `font-size: 15px`, `font-weight: 500`, `border-radius: 8px`, no border
- Label: **"Logg inn"**
- Hover state: background lightens slightly to `#3a4e3e`
- Loading state: button text changes to **"Logger inn…"** and button is disabled while auth request is in progress

### Footer note
- Below the button: `"Kontakt jaktleder for tilgang"` — `12px`, color `#aaa`, centered
- `margin-top: 1.25rem`

### Error message
- Appears between the password field and the login button when login fails
- Text: **"Feil e-post eller passord. Prøv igjen."**
- Style: `font-size: 13px`, color `var(--color-text-danger)` or `#c0392b`, centered
- Hidden by default (`display: none`), shown on auth failure

## Implementation Notes
- The topographic SVG background should be hardcoded inline in the HTML — no external image dependency
- The page must work without a server — all styles inline or in a `<style>` block within `login.html`
- `config.js` and `supabaseClient.js` must be loaded before the auth script
- After successful login, redirect to `index.html`
- If the user is already logged in (valid session exists), skip the login page and redirect directly to `index.html`
- The form should submit on Enter key as well as button click

## Full Page Structure
```html
<!DOCTYPE html>
<html lang="no">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Jaktlaget – Logg inn</title>
  <style>/* all styles here */</style>
</head>
<body>
  <!-- Full-page background with SVG topo overlay -->
  <!-- Centered login card -->
  <!--   - Icon + app name + subtitle -->
  <!--   - Email field -->
  <!--   - Password field -->
  <!--   - Error message (hidden) -->
  <!--   - Login button -->
  <!--   - Footer note -->

  <script src="config.js"></script>
  <script src="supabaseClient.js"></script>
  <script>/* auth logic */</script>
</body>
</html>
```

## Acceptance Criteria
- [ ] Page background is dark forest green with visible topographic SVG overlay
- [ ] Login card is centered both horizontally and vertically on all screen sizes
- [ ] Form fields have correct Norwegian labels and placeholders
- [ ] Focus states are visible on both fields
- [ ] Login button shows loading state during auth request
- [ ] Error message appears in Norwegian on failed login
- [ ] Successful login redirects to `index.html`
- [ ] Already-authenticated users are redirected to `index.html` without seeing the form
- [ ] Page works correctly on GitHub Pages (static, no server required)
