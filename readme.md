# iClimate System Explorer

A single-page, static system explorer built for the iClimate thesis defense.
Pure HTML / CSS / vanilla JS — no build step, no framework, deployable as-is.

## ⚠️ Before your defense: replace placeholder content

The real iClimate documentation wasn't pasted into the generation prompt, so
**every controller name, file path, database table, and console command in
this app is a realistic placeholder**, not your actual system's specifics.

All content lives in one file: **`data.js`**. Search that file for `⚠️ REPLACE`
to find every spot that needs your real values — controller/file paths,
table names, service names, and the exact step-by-step flow your system
actually uses. You do not need to touch `index.html`, `style.css`, or
`script.js` to update content; they just render whatever is in `data.js`.

## Files

- `index.html` — page skeleton and mount points for each section
- `style.css` — full design system (colors, type, layout, the animated flow-pipeline diagram)
- `script.js` — renders every section from `data.js` and handles nav/search/accordions
- `data.js` — **all your content lives here**
- `vercel.json` — minimal static-site config

## Run locally

No build step needed. Either:

```bash
# Option 1: just open it
open index.html

# Option 2: serve it (recommended, avoids any local file:// quirks)
npx serve .
```

## Deploy to Vercel

**Option A — Vercel CLI**
```bash
npm i -g vercel
cd iclimate-explorer
vercel
```
Follow the prompts (link/create a project, accept the defaults — it's a
static site, no build command needed).

**Option B — Git + Vercel dashboard**
1. Push this folder to a GitHub repo.
2. In the Vercel dashboard: **Add New → Project → Import** your repo.
3. Framework preset: **Other** (static). Leave build command empty,
   output directory as root (`.`).
4. Deploy.

## Extending it

- Add an 18th module: append an object to `D.modules` in `data.js` — it
  renders automatically with the next accordion number.
- Add a 4th role: append to `D.roles` the same way; a new sub-tab appears.
- The search box in the sidebar filters the Modules list live by name,
  description, and tech stack.