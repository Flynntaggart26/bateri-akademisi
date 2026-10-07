# Drum Academy 🥁

> **Read the beat. Make the kit speak.**
>
> A bilingual, interactive drum-learning studio for building rhythm from the first note to your own grooves.

[![Verify and deploy GitHub Pages](https://github.com/Flynntaggart26/bateri-akademisi/actions/workflows/pages.yml/badge.svg)](https://github.com/Flynntaggart26/bateri-akademisi/actions/workflows/pages.yml)
[![Live site](https://img.shields.io/badge/demo-live%20site-e8643d)](https://flynntaggart26.github.io/bateri-akademisi/)

**Live site:** [flynntaggart26.github.io/bateri-akademisi](https://flynntaggart26.github.io/bateri-akademisi/)<br>
**Languages:** English and Turkish — switch with **EN / TR** in the header.

## About

Drum Academy teaches the ideas behind playing the kit—not just where to hit. Short, focused lessons pair rhythm theory and drum notation with tools you can hear and play immediately. Start with note values and counting, then build coordination, grooves, rudiments, fills, dynamics, and odd meters at your own pace.

No account, installation, or build step is required. Lessons, the metronome, and the rhythm lab run in your browser.

## Features

- **Two complete interface languages:** English and Turkish, with a visible language switch and a remembered preference.
- **Ten guided lessons:** beginner, intermediate, and advanced material across four learning stages.
- **Drum-notation reference:** note values, subdivisions, rests, and a visual map of kick, snare, and hi-hat.
- **Four playable drum pads:** synthesized kick, snare, hi-hat, and tom sounds powered by the Web Audio API.
- **Metronome:** adjustable from 40–220 BPM, with tap tempo and a four-beat visual pulse.
- **16-step sequencer:** create, edit, clear, and play your own kick/snare/hi-hat patterns.
- **Local progress:** completed lessons and tempo are stored in the current browser; no account or server-side tracking.
- **Responsive and keyboard-friendly:** works on mobile, supports pad shortcuts, visible focus, and reduced-motion preferences.

## Learning path

| Stage | Topics |
| --- | --- |
| **01 · Listen** | Note values, rests, tempo, time signatures, and counting |
| **02 · Read** | Drum notation, first rock groove, and hand-foot coordination |
| **03 · Control** | Singles, doubles, paradiddles, groove variations, and fills |
| **04 · Create** | Independence, dynamics, and odd time signatures |

## Try the rhythm lab

1. Tap a drum pad or press a shortcut to hear its sound.
2. Set a comfortable BPM and start the metronome.
3. Toggle sequencer steps to make a pattern, then select **Play pattern**.
4. Open a lesson and mark it complete to keep track of your progress.

| Key | Sound |
| --- | --- |
| `1` | Kick drum |
| `2` | Snare |
| `3` | Hi-hat |
| `4` | Tom |

Shortcuts are ignored while typing in form controls. Audio starts after your first interaction, as required by modern browsers.

## Run locally

The site uses native HTML, CSS, and JavaScript modules. It has no runtime dependencies or build step. Serve the project root over HTTP so ES modules load correctly:

```sh
python -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000). Any static file server works.

## Tests

Requires Node.js 20 or later; the deployment workflow runs on Node.js 24.

```sh
node --check src/app.mjs
node --check src/core.mjs
node --check src/i18n.mjs
node --test
```

The test suite covers tempo normalization, saved progress and language preferences, and the presence of translations for every marked page string.

## Deployment

The `Verify and deploy GitHub Pages` workflow checks the JavaScript and tests, packages the static site, and deploys it to GitHub Pages on every push to `main`. It can also be started manually from the **Actions** tab.

For a fork, enable **Settings → Pages → Build and deployment → GitHub Actions**. GitHub will provide the deployed URL in the workflow run and Pages settings.

## Project structure

```text
.
├── .github/workflows/pages.yml  # verification and Pages deployment
├── index.html                   # accessible, bilingual page structure
├── styles.css                   # responsive visual design
├── src/
│   ├── app.mjs                  # interface, audio, metronome, sequencer
│   ├── core.mjs                 # tempo and browser-storage helpers
│   └── i18n.mjs                 # English/Turkish interface and lessons
└── tests/core.test.mjs          # Node.js tests
```

## Privacy

The app has no backend, analytics, or user accounts. Progress and language choice stay in your browser’s local storage. Drum sounds are synthesized locally; Google Fonts are loaded from Google Fonts when a network connection is available.

## Repository

[GitHub: Flynntaggart26/bateri-akademisi](https://github.com/Flynntaggart26/bateri-akademisi)
