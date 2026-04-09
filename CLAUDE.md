# CLAUDE.md — Menu Engineer Project Briefing

> Read this first. Last updated: April 2026.

## What This Project Is
Menu Engineer is a solo 48-hour hackathon build. Independent restaurant owners paste their menu with rough food cost estimates and get back a Stars / Puzzles / Plowhorses / Dogs analysis in 60 seconds — no sign-up, no POS, no consultant.

Output: visual matrix, price adjustment map, plain-English actions per item, downloadable PDF.

**v1 is live on Vercel. All 6 build phases are complete.**

## Owner
- GitHub: Wei-power3 | Name: Weiche Lin
- Limited technical background. Needs code explained, not assumed.
- Devices: Windows laptop (no admin rights), iPad (primary), iPhone
- Browser-only workflow — no terminal, no local installs

## Confirmed Stack
- Frontend: React 18 + Vite
- Styling: Plain CSS
- Deployment: Vercel (auto-deploys on push to main)
- AI engine: Gemini 2.0 Flash (`GEMINI_API_KEY` in Vercel env vars)
  - ⚠️ Temporarily swapped from Claude claude-sonnet-4-6. To revert, replace the Gemini fetch block in `api/analyze.js` with the Claude block from git history and swap env var to `ANTHROPIC_API_KEY`.
- PDF: jsPDF (client-side, no server needed)
- Repo: Wei-power3/menu-engineer

## Agent Workflow
- Perplexity (this Space) = PM + architect + coder + committer
- Claude Artifacts = code sandbox (test in chat, approve, then commit)
- Perplexity = fact-check and research on demand
- ChatGPT/Gemini excluded to avoid context fragmentation

## Markets
- Primary v1: US — 412K independent restaurants, 9.5K closed in 2025, ~5% margin
- Secondary v1 toggle: UK — DMCCA 2024 forces service charges into displayed prices from April 2025, CMA fines up to 10% global turnover
- Germany: dropped for v1

## Monetisation
Free to use, no sign-up. Pay-per-report to save/download. Goal: $100/month.

> Note: Stripe payment gate is deliberately deferred. PDF download is currently free. A `// TODO: PAYMENT GATE` comment marks the insertion point in PdfDownloadButton.jsx for when payment is added.

## Key Decisions
- React + Vercel: fancier output, zero manual deployment steps
- Gemini 2.0 Flash (temporary): owner's primary tool is Claude; Gemini is a cost/speed swap
- Owner-provided food cost % (no live ingredient API)
- No POS integration in v1
- US primary, UK day-2 toggle

## How the Analysis Actually Works

**Important:** The core menu engineering logic is deterministic JavaScript — NOT the LLM.

### Step 1 — `src/utils/menuAnalysis.js` (no AI, runs client-side)
All maths and classification happen here before any API call:
1. `foodCostAmount = price × (foodCostPct / 100)` — rounded to 2dp
2. `contributionMargin = price − foodCostAmount` — rounded to 2dp
3. `avgCM` = mean CM across all items (margin threshold)
4. `avgPrice` = mean price across all items (popularity proxy)
5. `marginLevel`: `high` if item CM ≥ avgCM, else `low`
6. `popularityLevel`: `high` if item price ≤ avgPrice, else `low` *(known heuristic — no sales data in v1)*
7. Category assigned from 2×2: Star / Puzzle / Plowhorse / Dog
8. `action` text from hardcoded `ACTION_TEMPLATES` by category
9. `priceRecommendation` from lookup: Star/Puzzle → `hold`, Plowhorse → `raise`, Dog → `cut`

### Step 2 — `api/analyze.js` (Gemini enrichment only)
The LLM receives the pre-computed numbers and fills in **only**:
- `marketContext` — typical local price range for this item/category in US or UK
- `ukComplianceNote` — DMCCA 2024 flag if market = UK

The LLM does **not** calculate margins, assign categories, or generate price recommendations.

## Known Weaknesses in the Algorithm Layer
1. **Popularity proxy is price ≤ avgPrice** — a known heuristic; no real sales data in v1
2. **Mean CM threshold** — sensitive to outliers; a single very-high-margin item skews classification
3. **priceRecommendation has no magnitude** — just raise/cut/hold, no $ amount
4. **marketContext is LLM-generated** — rough estimate until USDA AMS Phase 2 replaces it

## Repo Structure
```
menu-engineer/
├── CLAUDE.md
├── README.md
├── api/
│   └── analyze.js              ✅ Vercel serverless fn — Gemini enrichment only (marketContext + ukComplianceNote)
├── src/
│   ├── App.jsx                 ✅ orchestrates all views and components
│   ├── App.css                 ✅ full mobile-first styles, 375px breakpoints
│   ├── main.jsx
│   ├── components/
│   │   ├── MenuInputForm.jsx   ✅ US/UK selector, compliance banner, market-aware placeholder
│   │   ├── AnalysisMatrix.jsx  ✅ 2×2 Stars/Puzzles/Plowhorses/Dogs grid
│   │   ├── ItemCard.jsx        ✅ per-item display with action + market context
│   │   ├── PriceAdjustmentMap.jsx ✅ sortable table of all items by margin
│   │   ├── ActionsList.jsx     ✅ plain-English actions, lowest margin first
│   │   ├── PdfDownloadButton.jsx ✅ jsPDF client-side report
│   │   └── ErrorMessage.jsx    ✅ red alert box with retry
│   ├── hooks/
│   │   └── useMenuAnalysis.js  ✅ fetch lifecycle, loading/error state
│   └── utils/
│       └── menuAnalysis.js     ✅ deterministic analysis — all maths + classification, no LLM
├── docs/
│   ├── 00-meta.md              ✅
│   ├── 01-problem-research.md  ✅
│   ├── 02-benchmark-data-research.md ✅
│   ├── 03-build-plan.md        ✅
│   ├── 04-user-feedback-and-v2-proposal.md ✅
│   ├── 05-backlog.md           ✅
│   └── perplexity.md           ✅
├── vercel.json
├── vite.config.js
└── package.json
```

## Data Flow
```
Owner pastes menu text + chooses US/UK
        ↓
src/utils/menuAnalysis.js  (client-side, no API)
  → calculates foodCostAmount, contributionMargin
  → computes avgCM, avgPrice
  → assigns marginLevel, popularityLevel, category
  → generates action text + priceRecommendation
        ↓
POST /api/analyze  { menuText, market, precomputedItems }
        ↓
api/analyze.js  (reads GEMINI_API_KEY from Vercel env)
  → sends pre-computed data to Gemini 2.0 Flash
  → Gemini adds marketContext + ukComplianceNote only
  → returns enriched JSON
        ↓
Frontend renders:
  AnalysisMatrix + PriceAdjustmentMap + ActionsList + PdfDownloadButton
```

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

## Test Menu
```
Margherita Pizza, $14, 28% food cost
Truffle Pasta, $22, 35% food cost
House Burger, $16, 40% food cost
Caesar Salad, $12, 22% food cost
Tiramisu, $8, 30% food cost
```
Expected: Caesar Salad + Tiramisu = Stars (below avgPrice, above avgCM); House Burger = Plowhorse; Truffle Pasta = Dog or Puzzle (above avgPrice).

## v1 Definition of Done
- [x] Tool live at a public Vercel URL
- [x] Works on mobile browser (iPad/iPhone)
- [x] US mode: full matrix + PDF + sortable table
- [x] UK mode: DMCCA 2024 compliance notes per item
- [x] Deterministic analysis logic extracted to `src/utils/menuAnalysis.js`
- [ ] At least 1 real user has used it
- [ ] At least 1 post in a hospitality community

## Next Session — Post-v1 Priorities
1. **Community post** — r/restaurantowners, r/KitchenConfidential, or BigHospitality.co.uk
2. **Stripe payment gate** — add payment before PDF download (stub is in PdfDownloadButton.jsx)
3. **Algorithm upgrade** — improve popularity proxy and CM threshold (see `docs/05-backlog.md`)
4. **Phase 2: USDA AMS** — weekly ingredient cost trends via free USDA AMS API, replacing Gemini's rough marketContext with real data
5. **Saved reports** — Supabase when paying users justify it
6. **Revert to Claude** — swap GEMINI_API_KEY back to ANTHROPIC_API_KEY when ready
