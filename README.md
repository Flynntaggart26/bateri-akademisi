# Drum Academy 🥁

> **Read the beat. Make the kit speak.**
>
> A bilingual, interactive drum-learning studio for building rhythm from the first note to your own grooves.

[![Verify and deploy GitHub Pages](https://github.com/Flynntaggart26/bateri-akademisi/actions/workflows/pages.yml/badge.svg)](https://github.com/Flynntaggart26/bateri-akademisi/actions/workflows/pages.yml)
[![Live site](https://img.shields.io/badge/demo-live%20site-e8643d)](https://flynntaggart26.github.io/bateri-akademisi/)

**Live site:** [flynntaggart26.github.io/bateri-akademisi](https://flynntaggart26.github.io/bateri-akademisi/)<br>
**Languages:** English and Turkish — switch with **EN / TR** in the header.

## About

Drum Academy teaches the ideas behind playing the kit—not just where to hit. A progressive, 12-week curriculum pairs rhythm theory and drum notation with original practice drills you can hear and play immediately. Learn a concept, say and count it, isolate each limb, combine the parts, then apply the skill in a groove.

No account, installation, or build step is required. Lessons, the metronome, and the rhythm lab run in your browser.

## Features

- **Two complete interface languages:** English and Turkish, with a visible language switch and a remembered preference.
- **A 12-week learning path:** 12 guided lessons across four stages, from setup and pulse to an original final groove.
- **Structured practice sheets:** every lesson includes a weekly goal, notation/counting cues, a three-step exercise ladder, tempo guidance, a mastery check, and a troubleshooting tip.
- **Drum-notation reference:** note values, subdivisions, rests, and a visual map of kick, snare, and hi-hat.
- **Four playable drum pads:** synthesized kick, snare, hi-hat, and tom sounds powered by the Web Audio API.
- **Metronome:** adjustable from 40–220 BPM, with tap tempo and a four-beat visual pulse.
- **16-step sequencer:** create, edit, clear, and play your own kick/snare/hi-hat patterns.
- **Local progress:** completed lessons and tempo are stored in the current browser; no account or server-side tracking.
- **Research-informed study flow:** say-it/play-it, chunked coordination, controlled tempo progression, rudiments, style listening, and musical application.
- **Responsive and keyboard-friendly:** works on mobile, supports pad shortcuts, visible focus, and reduced-motion preferences.

## Learning path

| Stage | Weeks | Topics |
| --- | ---: | --- |
| **01 · Foundations** | 1–3 | Kit setup and posture; grip, rebound, and singles; note values and rests |
| **02 · Read & build** | 4–6 | Write–say–play; drum-set notation; coordination and layered groove-building |
| **03 · Control** | 7–10 | Rock backbeat; core rudiments; style vocabulary; syncopation and dynamics |
| **04 · Create** | 11–12 | Fills and song form; independence, odd meters, and a final groove |

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

The test suite covers tempo normalization, saved progress and language preferences, legacy progress migration, all 12 weekly lesson structures in both languages, and translation completeness for marked page strings.

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
│   └── i18n.mjs                 # English/Turkish interface and 12-week curriculum
└── tests/core.test.mjs          # Node.js tests
```

## Privacy

The app has no backend, analytics, or user accounts. Progress and language choice stay in your browser’s local storage. Drum sounds are synthesized locally; Google Fonts are loaded from Google Fonts when a network connection is available.

## Curriculum references

The course uses public teaching principles as inspiration, while all lesson explanations and practice drills are original:

- [Müzik Akademi — Bateri Ders Kitabı](https://muzikakademi.com.tr/bateri-kursu/bateri-ders-kitabi): topic map for weekly practice, rudiments, coordination, and styles.
- [Percussive Arts Society — 40 International Drum Rudiments](https://pas.org/rudiments): rudiment reference and open–close–open practice guidance.
- [John Leister — Percussion Teaching Strategies for Younger Beginners](https://pas.org/pas-blog/percussion-teaching-strategies-for-younger-beginners/): write–say–play, chunked groove-building, and adding limbs in sequence.
- [Berklee — Drum Set Practice Method](https://online.berklee.edu/store/product?category_id=21&product_id=11357&usca_p=t): daily practice, listening, multiple styles, song form, and musical interaction.
- [Vic Firth Education — A Fresh Approach to the Drumset](https://ae.vicfirth.com/wp-content/uploads/Fresh-Approach-to-Drumset-SAMPLER.pdf): technique, coordination, tempo, and kit application.

## Repository

[GitHub: Flynntaggart26/bateri-akademisi](https://github.com/Flynntaggart26/bateri-akademisi)
