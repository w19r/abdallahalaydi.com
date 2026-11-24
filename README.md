<div align="center">

# abdallah.

**A personal home for everything I make, each in its own world. Quiet, lasting things for the web.**

[![Live Site](https://img.shields.io/badge/Live-abdallahalaydi.com-111111?style=flat-square)](https://abdallahalaydi.com/)
[![HTML/CSS/JS](https://img.shields.io/badge/Stack-Vanilla_Web-383838?style=flat-square)](#)
[![Cloudflare](https://img.shields.io/badge/Edge-Cloudflare_Workers-F38020?style=flat-square&logo=cloudflare&logoColor=white)](#)
[![PWA](https://img.shields.io/badge/PWA-Enabled-5A0FC8?style=flat-square)](#)

[Website](https://abdallahalaydi.com/) · [Archive Case Study](https://abdallahalaydi.com/projects/archive/) · [GitHub](https://github.com/w19r)

</div>

---

## Overview

Personal portfolio and digital garden for **Abdallah Alaydi**, a Computer Systems Engineering student. Built from scratch without heavy frontend frameworks, prioritizing instant load times, clean typography, and long-term maintainability.

## Architecture & Highlights

- **Dual-Mode Experience (`Craft` & `Vibe`):** Seamless switching between engineering projects/case studies and personal interests without page reloads.
- **Modular Design System:** Token-driven CSS architecture (`tokens.css`, `base.css`, `layout.css`, `components.css`) supporting persistent dark/light themes and zero-flash rendering.
- **Edge-Powered Letterboxd Feed:** Real-time movie log and review integration powered by a custom `Cloudflare Worker` XML proxy paired with client-side `localStorage` caching (`0ms` repeat loads).
- **Decoupled Content Engine:** Dynamic rendering driven by structured JSON (`data/content.json`), interactive project drawers with CSS-only device mockups, and dedicated deep-dive case study pages.
- **Offline & SEO Ready:** Service Worker (`sw.js`) asset caching, `JSON-LD` (`Schema.org`) structured data, `llms.txt`, and automated Open Graph social previews.

## Project Structure

```text
[abdallahalaydi.com/](https://abdallahalaydi.com/)
├── index.html              # Main dual-mode entry point
├── projects/
│   └── archive/            # Full-stack Family Archive case study
├── data/
│   └── content.json        # Decoupled site & project metadata
├── scripts/
│   ├── app.js              # Theme, mode switching & UI interactions
│   └── render.js           # Dynamic DOM renderer & Letterboxd client
├── styles/                 # Modular CSS & design tokens
└── sw.js                   # Offline Service Worker
