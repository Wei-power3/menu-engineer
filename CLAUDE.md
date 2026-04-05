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
- AI engine: Claude API, model claude-sonnet-4-6
- API key: stored in Vercel environment variables, never in code
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
- Claude API: owner's primary tool
- Owner-provided food cost % (no live ingredient API)
- No POS integration in v1
- US primary, UK day-2 toggle

## Repo Structure
```
menu-engineer/
├── CLAUDE.md
├── README.md
├── api/
│   └── analyze.js              ✅ calls Claude claude-sonnet-4-6, real menu engineering logic
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
│   └── hooks/
│       └── useMenuAnalysis.js  ✅ fetch lifecycle, loading/error state
├── docs/
│   ├── 00-meta.md              ✅
│   ├── 01-problem-research.md  ✅
│   ├── 02-benchmark-data-research.md ✅
│   ├── 03-build-plan.md        ✅
│   └── perplexity.md           ✅
├── vercel.json
├── vite.config.js
└── package.json
```

## JSON Contract (Claude API → UI)
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
Expected: Truffle Pasta + Caesar Salad = Stars; House Burger = Plowhorse.

## v1 Definition of Done
- [x] Tool live at a public Vercel URL
- [x] Works on mobile browser (iPad/iPhone)
- [x] US mode: full matrix + PDF + sortable table
- [x] UK mode: DMCCA 2024 compliance notes per item
- [ ] At least 1 real user has used it
- [ ] At least 1 post in a hospitality community

## Next Session — Post-v1 Priorities
1. **Community post** — r/restaurantowners, r/KitchenConfidential, or BigHospitality.co.uk
2. **Stripe payment gate** — add payment before PDF download (stub is in PdfDownloadButton.jsx)
3. **Phase 2: USDA AMS** — weekly ingredient cost trends via free USDA AMS API, replacing Claude's rough marketContext with real data
4. **Saved reports** — Supabase when paying users justify it
