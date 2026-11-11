# Rep Your Side — React Edition

Production-grade React 19 / TypeScript / Vite application ported with 100% functional, visual, content, and storage parity from the vanilla prototype in `../source/dist/`.

## Features
- **Cities Supported:** Lagos (Island & Mainland) and Abuja (Phases 1–4, Satellite Towns, Municipal).
- **Core Gameplay:** City Trivia rounds, Street Sense scenarios, Answer Review, and Result modals.
- **Narrative Adventures:** 5-chapter Postcard Trail story with persistent progress cursor and completion awards.
- **Community Engagement:** Daily reflections (Activity dialog), Curated Discover places, Pulse insights, and Grassroots Circles.
- **Passport Progression:** Real-time XP tracking, 5 progression levels (Observer to Grand Ambassador), 10 milestone stamps, and special awards.
- **Data Durability & Recovery:** Local-first storage (`rep-your-side-pilot-v1`), JSON base64 backup export/import with checksum validation, raw storage recovery, and crash-resilient in-flight quiz resumption.
- **Styling:** Tailwind CSS v4 utilities layered over the pixel-identical baseline stylesheet with Preflight off to preserve exact UI dimensions.

---

## Getting Started

### Prerequisites
- Node.js 18+ (tested on Node 20+)
- npm 9+

### Installation
```bash
npm install
```

### Development Server
Starts the Vite local development server:
```bash
npm run dev
```

### Production Build
Runs TypeScript compiler verification (`tsc`) followed by Vite production bundling:
```bash
npm run build
```

### Test Suite
Runs the 43 Vitest unit, domain, and integration test specifications:
```bash
npm test
```

### Prototype Oracle Server
Starts a background HTTP server serving the reference prototype from `../source/dist/` at `http://localhost:8000` for side-by-side verification:
```bash
npm run oracle
```

---

## Directory Structure

```
frontend/
├── src/
│   ├── app/                    # App shell, modal host, toast host, hash routing
│   │   ├── AppShell.tsx
│   │   ├── ModalHost.tsx
│   │   ├── ToastHost.tsx
│   │   └── useHashRoute.ts
│   ├── context/                # Global PassportContext & storage synchronization
│   │   └── PassportContext.tsx
│   ├── data/                   # Static cultural fixtures & local port adapters
│   │   ├── fixtures.ts
│   │   └── local/
│   ├── domain/                 # Core TypeScript models, validation, scoring, awards
│   │   ├── model.ts
│   │   └── types.ts
│   ├── features/               # Route views and feature-specific dialogs
│   │   ├── circles/            # Grassroots circles & community promise
│   │   ├── discover/           # Curated cultural landmark directory
│   │   ├── home/               # Home dashboard, city selector, quick missions
│   │   ├── passport/           # Passport page, settings, export, restore, corrections
│   │   ├── play/               # Trivia quizzes, street sense, story trail, reflections
│   │   ├── pulse/              # Curated local pulse insights & categories
│   │   └── side/               # "Where's your side?" onboarding & selector
│   ├── ports/                  # Adapter seams for future Laravel API (Catalog, Progress, Backup, Browser)
│   ├── styles/                 # Tailwind v4 configuration, @theme tokens, and @apply layers
│   │   └── main.css
│   ├── ui/                     # Reusable UI primitives, SVG icons, and skyline art
│   │   ├── art.tsx
│   │   ├── icons.tsx
│   │   ├── MissionCard.tsx
│   │   ├── Pill.tsx
│   │   ├── PlaceCard.tsx
│   │   └── SourceBlock.tsx
│   ├── main.tsx                # Application bootstrap entrypoint
│   └── source.d.ts             # Type declarations for baseline .mjs fixtures
├── tests/                      # Automated parity verification suite (58 tests across 10 suites)
│   ├── cross-app-parity.test.ts# Cross-app model & bidirectional backup round-trip parity
│   ├── domain.test.ts          # Core domain models, levels, stamps, calculations
│   ├── e2e/                    # Playwright browser E2E & visual parity specs
│   ├── f1-shell.test.ts        # AppShell, routing, banners (RYS-01..03)
│   ├── f2-gameplay.test.ts     # Trivia, street sense, story, reflection (RYS-04..11)
│   ├── f3-features.test.ts     # Discover, Pulse, Circles, Passport (RYS-12..18)
│   ├── f4-recovery.test.ts     # Export, restore, corrections, reset (RYS-19..24)
│   ├── gate-g1-fixtures.test.ts# Gate G1 data fixture parity against data.mjs
│   ├── gate-g2-art.test.ts     # Gate G2 SVG icons and skyline art parity
│   ├── gate-g3-dom-parity.test.tsx # Gate G3 DOM structure & selector parity across all views/modals
│   └── gate-g4-tailwind.test.ts# Tailwind Step T3 migration & selector completeness verification
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Storage Schema & Parity Notes

Storage key: `rep-your-side-pilot-v1`.

The schema matches the baseline prototype version 1 schema:
```json
{
  "version": 1,
  "city": "lagos" | "abuja",
  "area": "island" | "mainland" | "phase1" | "phase2" | "phase3" | "phase4" | "satellite" | "municipal",
  "nickname": "string",
  "rounds": {},
  "street": {},
  "story": { "progress": 0, "completed": false },
  "activity": {},
  "saved": [],
  "pulse": [],
  "circles": [],
  "corrections": [],
  "inFlightQuiz": null
}
```

Detailed test results and discrepancy resolutions (D-01 through D-08) can be found in `../docs/parity-notes.md`.

