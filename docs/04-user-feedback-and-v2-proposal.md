# Post-v1 User Feedback Report & v2/v3 Product Proposal

> **Author:** Product Owner (Weiche Lin)
> **Date:** April 2026
> **Status:** v2 sprint in progress
> **Repo:** Wei-power3/menu-engineer

---

## Context

Menu Engineer v1 shipped on 5 April 2026 as a 48-hour hackathon build. The tool lets independent restaurant owners input their menu items and receive a Stars / Puzzles / Plowhorses / Dogs analysis (Kasavana & Smith, 1982) with price recommendations and a downloadable PDF.

After sharing the tool with an initial set of users, four feedback themes have emerged. This document records each theme verbatim, provides a product owner assessment grounded in the current codebase, and proposes a concrete fix for each.

---

## Architecture Decisions Log

| Decision | Outcome | Date | Rationale |
|---|---|---|---|
| LLM vs. pure JS for analysis | **Pure JS confirmed** | 5 Apr 2026 | Menu engineering is deterministic maths. LLM would produce different classifications for identical inputs — unacceptable for a trust-based tool. |
| LLM for OCR / photo scan | **Claude Vision permitted** | 5 Apr 2026 | Photo scan is data entry assistance, not analysis. Non-determinism in OCR (misreading a letter) is correctable by the user before analysis runs. |
| Analysis logic | **Pure JS, no changes** | 5 Apr 2026 | `menuAnalysis.js` classification formula is correct and auditable. Do not modify. |

---

## Completed — Week 1 Trust Fixes (shipped 5 Apr 2026)

Commit `83b193c` delivered all three P1 trust items:

- ✅ **Issue #3** — Per-item reasoning line in `ItemCard.jsx` showing CM vs. menu average and price vs. menu average
- ✅ **Issue #4** — Kasavana & Smith (1982) citation added to results page
- ✅ **Issue #5** — Popularity proxy caveat moved from input form to results page

---

## Feedback 1 — "I don't know my food cost off the top of my head"

### Verbatim Feedback
> *"The users don't always know the food costs out of their mind and don't want to calculate because they may know the raw ingredient prices but never calculated how much a burger costs."*

### Assessment
This is a **drop-off trigger**. The form requires food cost % as a mandatory field with no default and no calculation aid. Most independent restaurant operators know what they pay for ingredients but have never costed a finished dish.

A generic fallback (e.g. "burgers are typically 30%") is not credible because food cost % varies by restaurant format:

| Restaurant Type | Typical food cost % | Source |
|---|---|---|
| QSR / Fast Food | 25–30% | National Restaurant Association |
| Fast Casual | 28–33% | Forte SG COGS Benchmark (2025) |
| Casual Dining | 30–35% | Forte SG COGS Benchmark (2025) |
| Fine Dining | 30–40% | Forte SG COGS Benchmark (2025) |
| Bar / Beverage-led | 18–25% | Forte SG COGS Benchmark (2025) |
| Pizzeria | 20–28% | Forte SG COGS Benchmark (2025) |

### Proposed Fix — Week 2 Sprint

**Feature A — Restaurant-type selector → benchmark % pre-fill**

User picks their restaurant type once at the top of the form. Every food cost % field pre-fills with the format's midpoint benchmark. Label: *"Industry average for casual dining — edit to match your actual costs."* Fully editable. Source cited inline.

**Feature B — Ingredient cost calculator toggle (manual entry path)**

Optional "Calculate for me" toggle per row. Replaces the % field with: `Ingredient cost ($)`. App computes in real time:

```
foodCostPct = (ingredientCost / price) × 100
```

The calculated % displays as a read-only greyed value so the user understands the derivation.

**Feature C (deferred, Phase 3) — Recipe builder**
Per-item ingredient list that sums to total ingredient cost. Deferred until paying users justify the build.

---

## Feedback 2 — "I want to photograph my menu"

### Verbatim Feedback
> *"The users want to take a photo of their menu and let the item and price be captured and populated for analysis."*

### Assessment
Manual entry of 15–30 items is a significant friction barrier, particularly on mobile (iPad/iPhone is the owner's primary device). Photo capture is the natural interaction for this user group.

**OCR options evaluated:**

| Approach | Cost | Accuracy on menus | Decision |
|---|---|---|---|
| Tesseract.js (client-side WebAssembly) | Free | Medium — struggles with decorative fonts | Fallback only |
| Claude Vision API (already in stack) | ~$0.01–0.03/image | High — handles context and stylised fonts | **Recommended** |
| Google Cloud Vision | ~$1.50/1,000 images | High | Rejected — unnecessary new vendor |

### Proposed Fix — Week 2 Sprint

Camera/upload button above the form → image sent to Claude Vision API → name + price rows auto-populated → food cost % left blank and highlighted for user input → user reviews, corrects, then analyses.

**Extraction prompt for `api/scan.js` (new endpoint):**
```
Extract all food and drink items from this menu image. Return only a JSON array:
[{"name": "House Burger", "price": 16.00}, ...]
Include only items that have a visible price. Exclude section headings and descriptions.
```

Food cost % is intentionally not extracted — menus don't print cost data, and this keeps the owner engaged in the one field requiring their operational knowledge.

---

## Feedback 3 — "Why should I trust this recommendation?"

### Verbatim Feedback
> *"They don't know if the analysis is trustworthy. Why would they trust software saying 'you should increase your price'? What's the explanation or ground of this recommendation?"*

### Status: RESOLVED in Week 1 (commit `83b193c`)

Three trust layers shipped:
1. Per-item reasoning line exposing the classification maths
2. Kasavana & Smith (1982) citation on results page
3. Popularity proxy caveat moved to results page with honest methodology note

---

## Feedback 4 — "I want to know what my neighbours are charging and whether my costs are about to change" *(New — Manhattan operator)*

### Verbatim Feedback
> *"A New York Manhattan-based restaurant owner doesn't feel this is credible or useful. The industry knows that the cost of a dish should hopefully be between 15–30%. He wants to know: burger prices in the neighbourhood and ingredient price changes due to season, tariff, etc. It seems the cost doesn't have to be exact but the trend is important and the 'benchmark' of other shops."*

### Assessment

This is the most strategically significant piece of feedback received. It reframes the entire product value proposition.

**What the tool currently does:**
> Compares your menu against itself. "Your burger's margin is below average *of your own menu*."

**What this user wants:**
> Compares your menu against the market. "Your burger is priced below the neighbourhood average, and beef wholesale costs are up 12% this month."

He is correct that the 15–30% food cost rule is already known by every experienced operator. It is not the insight. The insight is:
1. **Competitive price context** — what are comparable restaurants nearby charging for the same dish?
2. **Ingredient cost trends** — are my input costs about to rise due to seasonality, tariffs, or supply shocks?

This transforms Menu Engineer from a one-time calculator into a **recurring decision-support tool** — something an owner checks monthly, not once. That is where retention and paid subscription revenue live.

### Two Distinct Features Required

**Feature 1 — Neighbourhood price benchmarking**

Data source: **Google Places API** — returns menu prices for nearby restaurants by cuisine type. Covers dense urban markets (Manhattan, London) extremely well.

User inputs zip code / postcode at onboarding. For each item analysed, the results show:
> *"Burgers in your area average $17.40. Your price is $16.00 — you have room to raise without exceeding local norms."*

This is the `marketContext` field that currently returns `null`. It now has a real, deterministic data source.

- API cost: ~$0.017 per Places query
- Deterministic: same zip + same dish type = same benchmark every time
- No LLM involved

**Feature 2 — Ingredient cost trend feed**

Data source: **USDA Agricultural Marketing Service (AMS)** — free weekly wholesale price reports for beef, poultry, produce, dairy, broken down by cut and region. No API key required.

Already planned in the roadmap as Phase 2 (`CLAUDE.md`). This feedback confirms it is the right priority.

What it shows per item:
> *"Ground beef wholesale prices in the Northeast are up 12% over the last 4 weeks."*
> *"Seasonal alert: tomato prices typically spike 20–30% in January–February."*

- Cost: $0 (free government API)
- Update frequency: weekly
- Scope: US only initially; UK equivalent is AHDB (Agriculture and Horticulture Development Board)

### Why This Does Not Conflict With the Pure-JS Decision

Both features are **deterministic data lookups**, not AI inference:
- Google Places returns a real average price from real listings
- USDA AMS returns a real wholesale price from real market reports

The analysis logic in `menuAnalysis.js` remains untouched. These features populate the `marketContext` field with real data instead of `null`.

### Scope Decision

This is **v3 work**, not v2. Rationale:
- v2 must first remove the input barrier (Feedback 1 + 2) so more users can complete the flow
- Google Places API requires a new API key, billing setup, and a location input field at onboarding
- USDA AMS requires a new data-fetching layer and caching strategy
- Neither should block the immediate food cost usability fixes

---

## Sprint Plan

### ✅ Week 1 — Trust (DONE)
- Issues #3, #4, #5 shipped in commit `83b193c`
- Pure-JS architecture confirmed

### 🔨 Week 2 — Remove Input Barrier (IN PROGRESS)

| Feature | Issue | Notes |
|---|---|---|
| Restaurant-type selector → benchmark % pre-fill | To be created | Feedback 1 — Feature A |
| Ingredient cost calculator toggle | To be created | Feedback 1 — Feature B |
| Menu photo scan (Claude Vision → auto-populate) | To be created | Feedback 2 |

### 💳 Week 3 — Revenue
- Stripe payment gate on PDF download (stub already in `PdfDownloadButton.jsx`)
- Community post: r/restaurantowners, BigHospitality.co.uk (no-code — do in parallel now)

### 🌍 Week 4+ — Market-Aware Analysis (v3)

| Feature | Data source | Cost | Effort |
|---|---|---|---|
| Neighbourhood price benchmarking | Google Places API | ~$0.02/query | Medium |
| Ingredient cost trend feed | USDA AMS API | Free | Medium |
| Seasonal price alerts | USDA AMS historical | Free | Small (once USDA wired) |
| Tariff impact alerts | USDA AMS + hardcoded table initially | Free | Small |
| UK ingredient trends | AHDB API | Free | Small (after US) |

---

## Full Prioritised Backlog

| Priority | Feature | Feedback | Sprint |
|---|---|---|---|
| ✅ Done | Trust reasoning in ItemCard | Feedback 3 | Week 1 |
| ✅ Done | Kasavana & Smith citation | Feedback 3 | Week 1 |
| ✅ Done | Popularity caveat to results page | Feedback 3 | Week 1 |
| 🔨 Next | Restaurant-type benchmark % pre-fill | Feedback 1 | Week 2 |
| 🔨 Next | Ingredient cost calculator toggle | Feedback 1 | Week 2 |
| 🔨 Next | Menu photo scan via Claude Vision | Feedback 2 | Week 2 |
| 🟡 Soon | Stripe payment gate | Monetisation | Week 3 |
| 🟡 Soon | Community post (r/restaurantowners) | v1 DoD | Now (no-code) |
| 🟢 Later | Neighbourhood price benchmarking (Google Places) | Feedback 4 | Week 4+ |
| 🟢 Later | USDA AMS ingredient cost trend feed | Feedback 4 | Week 4+ |
| 🟢 Later | Real popularity input (weekly covers) | Feedback 3 | Week 4+ |
| 🟢 Later | Recipe builder (per-item ingredient list) | Feedback 1 | Phase 3 |
| ⬜ Deferred | Saved reports (Supabase) | Roadmap | Post revenue |

---

## v1 Definition of Done — Status

```
- [x] Tool live at a public Vercel URL
- [x] Works on mobile browser (iPad/iPhone)
- [x] US mode: full matrix + PDF + sortable table
- [x] UK mode: DMCCA 2024 compliance notes  ← deferred to v3 (requires real data source)
- [ ] At least 1 real user has used it
- [ ] At least 1 post in a hospitality community
```

---

*Last updated: 5 April 2026. Feedback 4 (Manhattan operator) added. Sprint plan updated to reflect Week 1 completion and Week 2 scope.*
