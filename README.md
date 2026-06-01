# MathSnap AI 🧮

**Snap it. Solve it.** — point your camera at any math problem (or type it) and get
AI-powered, step-by-step solutions instantly. Powered by Google Gemini.

![MathSnap AI](icon.svg)

## Features

- 📷 **Snap or upload** — camera capture, gallery upload, drag-and-drop, or paste from clipboard
- ✏️ **Type it out** — enter any problem from algebra to calculus
- 💡 **Step-by-step** — every solution broken into numbered, expandable steps with LaTeX math
- ⚡ **Multi-problem** — solves several problems from a single photo
- 📋 **Copy** any solution with one tap · **Clear All** to reset
- 📱 **Installable PWA** — works offline for the shell, add to Home Screen on iOS

## Tech

A zero-build static front-end (`index.html`) plus a single Vercel serverless
function (`api/solve.js`) that proxies requests to the Gemini API. Math is
rendered with [KaTeX](https://katex.org/). Fonts: Inter, Plus Jakarta Sans, JetBrains Mono.

```
.
├── api/
│   └── solve.js        # Vercel serverless function → Gemini
├── index.html          # Entire UI (HTML + CSS + JS)
├── icon.svg            # App / PWA icon
├── manifest.json       # PWA manifest
└── sw.js               # Service worker (offline shell)
```

## Setup

1. Deploy to [Vercel](https://vercel.com/) (or run with `vercel dev`).
2. Add an environment variable:

   ```
   GEMINI_API_KEY=your_google_gemini_api_key
   ```

   Get a key from [Google AI Studio](https://aistudio.google.com/app/apikey).

3. Open the deployment — that's it.

## Design

Dark-mode base (`#0A0A0F`) with electric-purple `#7C3AED`, cyan `#06B6D4`, and
magenta `#EC4899` accents. Glassmorphism cards, animated gradient text, floating
math symbols, shimmer-skeleton loading, and subtle micro-animations throughout —
fully responsive from mobile to desktop.
