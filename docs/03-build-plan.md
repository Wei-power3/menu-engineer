# 03 — Build Plan

> Last updated: 2026-04-05
> Status: v1 draft — expect frequent updates as build progresses.
> Research finding: *"Internal analysis finds the problem; external benchmarks create conviction to act."* — see `02-benchmark-data-research.md`

---

## What We're Building

A React web app where restaurant owners paste their menu with food cost estimates and receive a menu engineering analysis (Stars / Puzzles / Plowhorses / Dogs) in under 60 seconds. No sign-up. Pay-per-report to download PDF.

---

## Folder Structure (target state)

```
menu-engineer/
├── api/
│   └── analyze.js              ← Vercel serverless fn (Claude API lives here)
├── src/
│   ├── components/
│   │   ├── MenuInputForm.jsx       ← landing page / input
│   │   ├── AnalysisMatrix.jsx      ← 2×2 Stars/Puzzles/Plowhorses/Dogs grid
│   │   ├── ItemCard.jsx            ← reusable card inside the matrix
│   │   ├── PriceAdjustmentMap.jsx  ← sortable table of recommendations
│   │   ├── ActionsList.jsx         ← plain-English advice per item
│   │   ├── LoadingSpinner.jsx
│   │   ├── ErrorMessage.jsx
│   │   └── PdfDownloadButton.jsx
│   ├── hooks/
│   │   └── useMenuAnalysis.js  ← fetch lifecycle, loading/error state
│   ├── utils/
│   │   ├── formatCurrency.js   ← US $ / UK £
│   │   └── pdfGenerator.js     ← jsPDF + html2canvas
│   ├── App.jsx                 ← view state: 'input' | 'loading' | 'results'
│   └── main.jsx
├── vercel.json                 ← routes /api/* to serverless functions
├── vite.config.js
└── package.json
```

---

## Data Flow

```
Paste menu text + choose US/UK
        ↓
POST /api/analyze  { menuText, market }
        ↓
api/analyze.js  (reads ANTHROPIC_API_KEY from Vercel env)
  → calls Claude claude-sonnet-4-6
  → returns structured JSON
        ↓
Frontend renders:
  AnalysisMatrix + PriceAdjustmentMap + ActionsList + PdfDownloadButton
```

---

## JSON Contract (Claude → UI)

Every UI component reads from this shape. Claude must return this exactly.

```json
{
  "summary": {
    "totalItems": 5,
    "averageContributionMargin": 10.50,
    "currency": "USD",
    "stars": 2,
    "puzzles": 1,
    "plowhorses": 1,
    "dogs": 1
  },
  "items": [
    {
      "name": "Truffle Pasta",
      "price": 22,
      "foodCostPct": 35,
      "foodCostAmount": 7.70,
      "contributionMargin": 14.30,
      "category": "Star",
      "popularityLevel": "high",
      "marginLevel": "high",
      "action": "Keep price, feature prominently on menu.",
      "marketContext": "Pasta dishes in US casual dining typically range $18–26. Your price is well-positioned.",
      "priceRecommendation": "hold",
      "ukComplianceNote": null
    }
  ]
}
```

Matrix placement logic:
- **Stars** → `popularityLevel: high` + `marginLevel: high`
- **Plowhorses** → `popularityLevel: high` + `marginLevel: low`
- **Puzzles** → `popularityLevel: low` + `marginLevel: high`
- **Dogs** → `popularityLevel: low` + `marginLevel: low`

The `marketContext` field is a v1 mechanism to add a lightweight external anchor per item. Claude draws on its training knowledge to provide a rough local price range by category and market (US or UK). This is not live data — it's a best-effort reference. It will be replaced by USDA AMS data in Phase 2.

---

## Build Sequence

Each phase is independently testable before moving to the next.

| Phase | What you build | Done when... |
|---|---|---|
| **1. Scaffold** | Vite+React project, push to GitHub, connect Vercel | Live URL exists (even if blank) |
| **2. API layer** | `api/analyze.js` with Claude prompt (including market context instruction) | Paste menu in console, get JSON back with `marketContext` field populated |
| **3. Input + loading** | `MenuInputForm`, `LoadingSpinner`, `useMenuAnalysis` hook | Full round-trip works, result in console |
| **4. Results** | `AnalysisMatrix`, `ItemCard`, `PriceAdjustmentMap`, `ActionsList` | Real Claude output displays on screen, `marketContext` visible per item |
| **5. Polish** | `PdfDownloadButton`, mobile CSS, `ErrorMessage` | Works on iPhone Safari |
| **6. UK toggle** | Market selector, UK prompt branch, compliance notes | UK mode shows £ and DMCCA 2024 notes |

### Claude Prompt — Market Context Instruction (Phase 2 of the prompt, not the roadmap)

The `api/analyze.js` prompt must instruct Claude to populate `marketContext` per item. Add this to the prompt:

```
For each item, add a "marketContext" field: one sentence using your knowledge of typical
US (or UK) restaurant pricing for this category. Format:
"[Category] items in [market] [restaurant tier] typically range [low]–[high].
Your price is [above / below / within] this range."
Be honest about uncertainty — if the category is unusual, say so.
This is a rough reference, not live data.
```

This costs nothing, requires no API integration, and directly addresses the research finding that operators need an external anchor to act on repricing recommendations.

---

## Key Technical Decisions

| Decision | Choice | Reason |
|---|---|---|
| Build tool | Vite (not CRA) | Faster builds, better Vercel support |
| CSS | Plain CSS, no framework | Smaller bundle, no dependency debt |
| Routing | None (view state) | Single-page flow doesn't need a router |
| PDF | jsPDF + html2canvas | Runs client-side, no server needed |
| API key security | Vercel env var + serverless fn only | Key never touches the frontend bundle |

---

## Vercel Setup (one-time, all in browser)

1. vercel.com → Add New Project → import `Wei-power3/menu-engineer`
2. Settings → Environment Variables → add `ANTHROPIC_API_KEY`
3. Redeploy → every future push to `main` auto-deploys

---

## Package Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "jspdf": "^2.5.1",
    "html2canvas": "^1.4.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^5.0.0"
  }
}
```

---

## Post-v1 Roadmap

Phased in priority order based on research findings (see `02-benchmark-data-research.md`).

### Phase 2 — USDA AMS ingredient cost signals
Add weekly commodity price trends to each item's output. Replaces the rough Claude `marketContext` with a real cost-side anchor.

- **Data source:** USDA AMS MARS API — free, no API key required, updated 2,000+ times/week
- **Coverage:** beef, pork, poultry, dairy, eggs, produce
- **What it adds:** "Beef prices rose 6% over the past month" alongside the burger recommendation
- **Why it matters:** Research shows cost-side signals (not just internal margin) are the primary trigger for operator repricing action
- **Build approach:** New serverless function `api/commodity-trends.js` fetches USDA AMS on demand or cached daily; results injected into the Claude prompt as context

### Phase 3 — User-uploaded competitor menus
Accept competitor menu uploads (same OCR/parse pipeline). Build a local price range per category from what the owner provides. No scraping, no ToS liability.

### Phase 4 — Commercial local price feeds
Evaluate Datassential or RMS licensed data. Only justified once paying users and margins support the data cost.

---

## Deliberately Deferred (no phase assigned)

- Stripe payment gate on PDF download (stub comment left in code as `// TODO: PAYMENT GATE`)
- Saved reports / database (Supabase when needed)
- Sales volume input (Claude infers popularity from menu position for now)
- German market toggle
- Batch upload (multiple menus)
- Email delivery of PDF report

---

## Test Menu (use this to verify each phase)

```
Margherita Pizza, $14, 28% food cost
Truffle Pasta, $22, 35% food cost
House Burger, $16, 40% food cost
Caesar Salad, $12, 22% food cost
Tiramisu, $8, 30% food cost
```

Expected: Truffle Pasta and Caesar Salad as Stars; House Burger as Plowhorse.
