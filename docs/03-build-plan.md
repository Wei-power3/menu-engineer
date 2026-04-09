# 03 — Build Plan

> Last updated: 2026-04-09
> Status: ✅ v1 complete — all 6 phases shipped.
> Research finding: *“Internal analysis finds the problem; external benchmarks create conviction to act.”* — see `02-benchmark-data-research.md`

---

## What We Built

A React web app where restaurant owners paste their menu with food cost estimates and receive a menu engineering analysis (Stars / Puzzles / Plowhorses / Dogs) in under 60 seconds. No sign-up. PDF download included.

---

## Folder Structure (current state)

```
menu-engineer/
├── api/
│   └── analyze.js              ✅ Vercel serverless fn — Gemini 2.0 Flash enrichment only
├── src/
│   ├── components/
│   │   ├── MenuInputForm.jsx       ✅ US/UK market selector, DMCCA compliance banner
│   │   ├── AnalysisMatrix.jsx      ✅ 2×2 Stars/Puzzles/Plowhorses/Dogs grid
│   │   ├── ItemCard.jsx            ✅ reusable card — price, margin, action, market context
│   │   ├── PriceAdjustmentMap.jsx  ✅ sortable table of all items ranked by margin
│   │   ├── ActionsList.jsx         ✅ plain-English actions, lowest margin shown first
│   │   ├── ErrorMessage.jsx        ✅ red alert box with retry button
│   │   └── PdfDownloadButton.jsx   ✅ jsPDF client-side — full report with all sections
│   ├── hooks/
│   │   └── useMenuAnalysis.js      ✅ fetch lifecycle, loading/error state
│   ├── utils/
│   │   └── menuAnalysis.js         ✅ deterministic analysis — all maths + classification, no LLM
│   ├── App.jsx                     ✅ view state: input | loading | results
│   ├── App.css                     ✅ mobile-first, 375px breakpoints, 44px touch targets
│   └── main.jsx
├── vercel.json                     ✅ routes /api/* to serverless functions
├── vite.config.js
└── package.json
```

---

## How the Analysis Works (Two-Stage Pipeline)

### Stage 1 — Deterministic pre-processing (`src/utils/menuAnalysis.js`)

All maths and classification run **client-side in JavaScript before any API call**:

1. `foodCostAmount = price × (foodCostPct / 100)` — rounded to 2dp
2. `contributionMargin = price − foodCostAmount` — rounded to 2dp
3. `avgCM` = mean CM across all items (used as margin threshold)
4. `avgPrice` = mean price across all items (used as popularity proxy)
5. `marginLevel`: `high` if item CM ≥ avgCM, else `low`
6. `popularityLevel`: `high` if item price ≤ avgPrice, else `low`
7. Category from 2×2: Star / Puzzle / Plowhorse / Dog
8. `action` from hardcoded `ACTION_TEMPLATES` per category
9. `priceRecommendation` from lookup: Star/Puzzle → `hold`, Plowhorse → `raise`, Dog → `cut`

> Note: popularityLevel uses price as a demand proxy — cheaper items assumed to sell more. This is a known v1 heuristic; will be improved when real sales data is available.

### Stage 2 — LLM enrichment (`api/analyze.js`)

Gemini 2.0 Flash receives the pre-computed items and adds only:
- `marketContext` — typical local price range for this item/category (US or UK)
- `ukComplianceNote` — DMCCA 2024 compliance flag when market = UK

The LLM does **not** calculate margins, assign categories, or generate price recommendations.

---

## Data Flow

```
Owner pastes menu text + chooses US/UK
        ↓
src/utils/menuAnalysis.js  (client-side, deterministic, no API)
  → calculates foodCostAmount, contributionMargin
  → computes avgCM, avgPrice
  → assigns marginLevel, popularityLevel, category
  → generates action text + priceRecommendation
        ↓
POST /api/analyze  { menuText, market }
        ↓
api/analyze.js  (reads GEMINI_API_KEY from Vercel env)
  → sends menu + context to Gemini 2.0 Flash
  → Gemini returns marketContext + ukComplianceNote per item
  → merged with pre-computed results
        ↓
Frontend renders:
  AnalysisMatrix + PriceAdjustmentMap + ActionsList + PdfDownloadButton
```

---

## JSON Contract (Analysis Engine → UI)

```json
{
  "summary": {
    "totalItems": 5,
    "averageContributionMargin": 10.50,
    "averagePrice": 14.40,
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
      "action": "Truffle Pasta is your top performer. Keep the price at $22.00, give it prime menu placement, and consider highlighting it visually.",
      "marketContext": "Pasta dishes in US casual dining typically range $18-26. Your price is well-positioned.",
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

---

## Build Sequence — Completed

| Phase | What was built | Status |
|---|---|---|
| **1. Scaffold** | Vite+React project, pushed to GitHub, connected Vercel | ✅ Done |
| **2. API layer** | `api/analyze.js` with Gemini prompt + marketContext instruction | ✅ Done |
| **3. Input + loading** | `MenuInputForm`, loading state, `useMenuAnalysis` hook | ✅ Done |
| **4. Results** | `AnalysisMatrix`, `ItemCard`, `PriceAdjustmentMap`, `ActionsList` | ✅ Done |
| **5. Polish** | `PdfDownloadButton`, mobile CSS, `ErrorMessage` | ✅ Done |
| **6. UK toggle** | Market selector, UK prompt branch, DMCCA 2024 compliance notes | ✅ Done |

---

## Key Technical Decisions

| Decision | Choice | Reason |
|---|---|---|
| Build tool | Vite (not CRA) | Faster builds, better Vercel support |
| CSS | Plain CSS, no framework | Smaller bundle, no dependency debt |
| Routing | None (view state in App.jsx) | Single-page flow doesn’t need a router |
| PDF | jsPDF (dynamic import) | Runs client-side, no server needed, lazy-loaded to keep initial bundle small |
| API key security | Vercel env var + serverless fn only | Key never touches the frontend bundle |
| Analysis logic | Deterministic JS (`menuAnalysis.js`) | Reproducible, no LLM drift, testable, no API cost for core maths |
| AI role | Enrichment only (marketContext + ukComplianceNote) | LLM adds language/context; deterministic code owns classification |
| AI engine | Gemini 2.0 Flash (temporary) | Swapped from Claude for cost/speed; revert path documented in `api/analyze.js` |

---

## Vercel Setup (one-time, all in browser)

1. vercel.com → Add New Project → import `Wei-power3/menu-engineer`
2. Settings → Environment Variables → add `GEMINI_API_KEY`
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

### Immediate — Stripe payment gate
Add payment before PDF download. Stub comment `// TODO: PAYMENT GATE` is already in `PdfDownloadButton.jsx`.

### Phase 1.5 — Algorithm upgrade
Improve the two known weaknesses in `menuAnalysis.js`:
- Replace mean CM threshold with median (more robust to outliers)
- Replace price-as-popularity-proxy with a scored heuristic (position + item type + relative price)
- Add $ magnitude to priceRecommendation (not just raise/cut/hold)

See `docs/05-backlog.md` for full spec.

### Phase 2 — USDA AMS ingredient cost signals
Add weekly commodity price trends to each item’s output. Replaces Gemini’s rough `marketContext` with a real cost-side anchor.

- **Data source:** USDA AMS MARS API — free, no API key required, updated 2,000+ times/week
- **Coverage:** beef, pork, poultry, dairy, eggs, produce
- **What it adds:** “Beef prices rose 6% over the past month” alongside the burger recommendation
- **Build approach:** New serverless function `api/commodity-trends.js` fetches USDA AMS on demand or cached daily; results injected into the Gemini prompt as context

### Phase 3 — User-uploaded competitor menus
Accept competitor menu uploads (same parse pipeline). Build a local price range per category from what the owner provides. No scraping, no ToS liability.

### Phase 4 — Commercial local price feeds
Evaluate Datassential or RMS licensed data. Only justified once paying users and margins support the data cost.

---

## Deliberately Deferred

- Stripe payment gate on PDF download (stub comment left in code as `// TODO: PAYMENT GATE`)
- Saved reports / database (Supabase when needed)
- Sales volume input (popularity uses price proxy for now)
- German market toggle
- Batch upload (multiple menus)
- Email delivery of PDF report
- Revert from Gemini to Claude (documented revert path in `api/analyze.js`)

---

## Test Menu

```
Margherita Pizza, $14, 28% food cost
Truffle Pasta, $22, 35% food cost
House Burger, $16, 40% food cost
Caesar Salad, $12, 22% food cost
Tiramisu, $8, 30% food cost
```

AvgPrice = $14.40 | AvgCM ≈ $9.58
Expected classifications by `menuAnalysis.js`:
- Tiramisu ($8, CM $5.60) — price below avg → popular; CM below avg → **Plowhorse**
- Caesar Salad ($12, CM $9.36) — price below avg → popular; CM below avg → **Plowhorse**
- Margherita Pizza ($14, CM $10.08) — price at avg → popular; CM above avg → **Star**
- House Burger ($16, CM $9.60) — price above avg → low popularity; CM above avg → **Puzzle**
- Truffle Pasta ($22, CM $14.30) — price above avg → low popularity; CM above avg → **Puzzle**
