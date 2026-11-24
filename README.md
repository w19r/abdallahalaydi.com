# abdallah.

A personal home for everything I make, each in its own world. I build quiet, lasting things for the web.

Live at [abdallahalaydi.com](https://abdallahalaydi.com)

---

### Architecture

- **Dual-Mode Interface (`Craft` & `Vibe`):** Seamless switching between engineering work and personal interests without page reloads.
- **Modular Token System:** Pure CSS architecture (`tokens.css`, `base.css`, `layout.css`, `components.css`) with persistent dark/light themes and zero-flash loading.
- **Edge-Proxied Letterboxd Feed:** A custom `Cloudflare Worker` caches and serves my Letterboxd RSS XML every 3 minutes—bypassing slow third-party aggregators—paired with `localStorage` caching for instant repeat renders.
- **Decoupled Content & Case Studies:** Structured JSON data layer (`data/content.json`), interactive project drawers with CSS-only device mockups, and dedicated case study pages (`/projects/archive/`).
- **Offline & Discoverability:** Service Worker caching (`sw.js`), `Schema.org` (`JSON-LD`) metadata, and `llms.txt`.

### Structure

```text
├── index.html              # Dual-mode entry point
├── projects/archive/       # Family Archive case study
├── data/content.json       # Site & project metadata
├── scripts/
│   ├── app.js              # Theme, mode switching & UI state
│   └── render.js           # Dynamic renderer & Letterboxd XML parser
├── styles/                 # Design tokens & modular stylesheets
└── sw.js                   # Offline Service Worker
