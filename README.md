# Menu Engineer

> AI-powered menu engineering for independent restaurant owners.  
> Paste your menu. Get a Stars / Puzzles / Plowhorses / Dogs analysis in 60 seconds — no POS, no consultant, no signup.

---

## The Problem

Independent restaurant owners price menus by gut feel. Food costs are up 35% since 2019, margins sit at ~5%, and a professional menu engineering engagement costs ~$3,000. Most owners have never heard of the framework — let alone used it.

This tool gives every owner access to the same analysis, for free, in under a minute.

---

## Target Users

- 🇺🇸 US independent restaurant owners facing tariff-driven cost shocks
- 🇬🇧 UK restaurant owners repricing menus under the DMCCA 2024 service charge law

---

## How It Works

1. Paste your menu items with prices and estimated food cost %
2. AI classifies every item as Star / Puzzle / Plowhorse / Dog
3. Get a visual matrix + plain-English actions per item
4. Download a PDF report

---

## Stack

| Layer | Choice |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Plain CSS |
| AI engine | Claude claude-sonnet-4-6 (Anthropic) |
| API layer | Vercel serverless functions |
| Deployment | Vercel (auto-deploy on push to main) |
| PDF | jsPDF (client-side) |

---

## Documentation

| Doc | Status |
|---|---|
| [00 — Meta](docs/00-meta.md) | ✅ Ready |
| [01 — Problem Research](docs/01-problem-research.md) | ✅ Ready |
| [02 — Benchmark Data Research](docs/02-benchmark-data-research.md) | ✅ Ready |
| [03 — Build Plan](docs/03-build-plan.md) | ✅ Ready |

---

## Build Status

| Phase | What | Status |
|---|---|---|
| 1 | Scaffold — Vite + React, Vercel, GitHub | ✅ Done |
| 2 | API layer — Claude serverless function | ✅ Done |
| 3 | Input + loading — form, hook, round-trip | ✅ Done |
| 4 | Results — Matrix, ItemCard, PriceAdjustmentMap, ActionsList | ✅ Done |
| 5 | Polish — PDF download, ErrorMessage, mobile CSS | ✅ Done |
| 6 | UK toggle — DMCCA 2024 compliance notes | ✅ Done |

**v1 shipped — April 2026**

---

## Local Development

> You need Node.js installed. If you're on iPad/iPhone, use the Vercel dashboard — no local setup required.

```bash
npm install
npm run dev
```

Set `ANTHROPIC_API_KEY` as an environment variable in Vercel (Settings → Environment Variables). Never put it in code.

---

## Built by

Weiche Lin — April 2026
