# Post-v1 User Feedback Report & v2 Product Proposal

> **Author:** Product Owner (Weiche Lin)
> **Date:** April 2026
> **Status:** Awaiting sprint planning sign-off
> **Repo:** Wei-power3/menu-engineer

---

## Context

Menu Engineer v1 shipped on 5 April 2026 as a 48-hour hackathon build. The tool lets independent restaurant owners paste their menu and receive a Stars / Puzzles / Plowhorses / Dogs analysis (Kasavana & Smith, 1982) with price recommendations and a downloadable PDF.

After sharing the tool with an initial set of users, three clear feedback themes emerged. This document records each theme verbatim, provides a product owner assessment grounded in the current codebase, and proposes a concrete fix for each.

---

## Architecture Note — v1 Regression (Critical)

Before addressing user feedback, a regression introduced on 5 April 2026 must be acknowledged.

The latest commit (`be13dad`) removed the Claude API entirely in favour of pure client-side JavaScript (`src/utils/menuAnalysis.js`). This resolved API key and cost concerns but introduced a significant product downgrade:

| Capability | Claude API (original) | Pure JS (current) |
|---|---|---|
| Action text per item | AI-generated, context-aware | Template strings |
| Market context | Real pricing benchmarks | `null` |
| UK DMCCA compliance notes | Per-item, AI-generated | `null` |
| Popularity classification | Based on sales intent | Price-position heuristic only |

`CLAUDE.md` still describes the Claude API as the AI engine. This discrepancy between documentation and code must be resolved before v2 work begins.

**Decision required:** Restore Claude API for action/context generation, or accept pure-JS and update all documentation accordingly.

---

## Feedback 1 — "I don't know my food cost off the top of my head"

### Verbatim Feedback
> *"The users don't always know the food costs out of their mind and don't want to calculate because they may know the raw ingredient prices but never calculated how much a burger costs."*

### Current Behaviour
`MenuInputForm.jsx` requires three fields per row: item name, price, and **food cost %** — all mandatory before analysis runs. There is no calculation aid, no default, and no fallback if a user does not know the percentage.

```jsx
// MenuInputForm.jsx — food cost % is mandatory, no default or helper
<input
  type="number"
  placeholder="40"
  min="1"
  max="99"
  step="0.1"
  value={row.foodCostPct}
  onChange={(e) => updateRow(row.id, 'foodCostPct', e.target.value)}
  aria-label="Food cost percentage"
/>
```

### Assessment
This is a **drop-off trigger**. Most independent restaurant operators know what they pay for ingredients (e.g. a beef patty costs $2.50) but have never sat down and costed a dish. Asking for food cost % as a raw number assumes knowledge that typically lives in a spreadsheet or accountant's head — not in the owner's working memory.

A generic fallback (e.g. "burgers are typically 30%") is not credible because food cost % varies significantly by restaurant format and dish category:

| Restaurant Type | Typical food cost % |
|---|---|
| QSR / Fast Food | 25–30% |
| Fast Casual | 28–33% |
| Casual Dining | 30–35% |
| Fine Dining | 30–40% |
| Bar / Beverage-led | 18–25% |
| Pizzeria | 20–28% |

Source: National Restaurant Association industry benchmarks; Forte SG COGS benchmark report (2025).

Within each format, dish categories shift the number further: protein-heavy dishes (beef, seafood) run 3–8% higher than the format average; pasta, rice, and desserts run 4–8% lower.

### Proposed Fix — Two-Phase Approach

**Phase 2a (next sprint) — Restaurant-type benchmark pre-fill**

Add a restaurant-type selector at the top of the form (QSR / Fast Casual / Casual Dining / Fine Dining / Bar / Pizzeria). When selected, pre-fill every food cost % field with the format's midpoint benchmark. Label it clearly: *"Industry average for casual dining — edit to match your actual costs."*

This gives users a credible, citable starting point that they can override, rather than leaving the field blank.

**Phase 2b (next sprint) — Ingredient cost calculator toggle**

Add an optional "Calculate for me" toggle per row. When activated, replace the % field with two sub-fields: `Ingredient cost ($)` and `Selling price ($)`. The app computes the % in real time:

```
foodCostPct = (ingredientCost / sellingPrice) × 100
```

This matches the mental model of owners who know "the beef for my burger costs $3.20" but not the resulting percentage. The calculated % is shown as a read-only greyed value so the user understands what the app is doing.

**Phase 3 (deferred) — Recipe builder**
A per-item ingredient list (e.g. bun $0.30 + beef $2.50 + sauce $0.15) that sums to a total ingredient cost. Larger lift; deferred until paying users justify the development.

**Why this earns trust:**
The benchmark is explicitly attributed to industry sources, presented as editable (not authoritative), and scoped by restaurant type — matching the specificity users expect from a professional tool. This is analogous to the Big Mac Index methodology: a transparent, consistently-applied benchmark that invites comparison rather than demanding blind acceptance.

---

## Feedback 2 — "I want to photograph my menu"

### Verbatim Feedback
> *"The users want to take a photo of their menu and let the item and price be captured and populated for analysis."*

### Current Behaviour
Data entry is entirely manual. Users must type every item name, price, and food cost % into the structured row form. For a restaurant menu of 15–30 items, this is a significant time investment.

### Assessment
Restaurant menus are physical objects that owners handle every day. Photo capture is the natural interaction for this user group — particularly on mobile (iPad/iPhone, the owner's primary device per `CLAUDE.md`).

OCR (Optical Character Recognition) converts image text to machine-readable strings. Two viable approaches were evaluated:

| Approach | Library / API | Cost | Accuracy on menus | Verdict |
|---|---|---|---|---|
| **Client-side OCR** | [Tesseract.js](https://github.com/naptha/tesseract.js) (38k ⭐, actively maintained) | Free | Medium — struggles with decorative / script fonts | Good for MVP fallback |
| **LLM vision extraction** | Claude Vision API (already in stack) | ~$0.01–0.03 / image | High — understands context, handles decorative fonts, infers item vs. description | Recommended |
| **Google Cloud Vision** | REST API | ~$1.50 / 1,000 images | High | Adds new vendor dependency unnecessarily |

**Tesseract.js** is a pure JavaScript WebAssembly port of Google's Tesseract OCR engine. It runs entirely in the browser with no server call required and supports 100+ languages. It is suitable as a zero-cost fallback but its accuracy on stylised menu typography is inconsistent. Reference implementations: [freeconvertfileto/image-to-text-js](https://github.com/freeconvertfileto/image-to-text-js), [Raunaksplanet/PNG-OCR-Side-Project](https://github.com/Raunaksplanet/PNG-OCR-Side-Project).

**Claude Vision** is the recommended path because it reuses the existing API infrastructure, handles real-world menu formats reliably, and can extract structured data rather than raw text.

### Proposed Fix — Claude Vision Menu Scan

**Extraction prompt (to be added to `api/analyze.js` or a new `api/scan.js`):**
```
Extract all food and drink items from this menu image. Return only a JSON array:
[{"name": "House Burger", "price": 16.00}, ...]
Include only items that have a visible price. Do not include section headings, descriptions, or prices without an associated item name.
```

**UX flow:**
1. Camera icon button above the form table opens the native file picker with `capture="environment"` (triggers camera on mobile)
2. "Scanning your menu…" loading state while API processes the image
3. Name + price rows are auto-populated; food cost % column is left blank and highlighted
4. User reviews and corrects any misreads, then adds food cost % (via benchmark pre-fill or ingredient calculator from Feedback 1)
5. Analyse as normal

**Important constraint:** Food cost % is intentionally *not* extracted from the photo. Menus do not print cost data, and this keeps the user engaged in the one field that requires their operational knowledge.

---

## Feedback 3 — "Why should I trust this recommendation?"

### Verbatim Feedback
> *"They don't know if the analysis is trustworthy. Why would they trust software saying 'you should increase your price'? What's the explanation or ground of this recommendation?"*

### Current Behaviour

Action text is generated from template strings in `menuAnalysis.js`:

```js
// menuAnalysis.js — current template actions, no reasoning shown
Plowhorse: (item, sym) =>
  `${item.name} is popular but thin on margin at ${sym}${item.contributionMargin.toFixed(2)} CM.
   Try raising the price by ${sym}1–2 or reducing the portion slightly.`,
```

In `ItemCard.jsx`, the recommendation label ("Raise price", "Hold price", "Cut or rethink") is shown next to the item name with no explanation of how the classification was reached:

```jsx
// ItemCard.jsx — recommendation label with no reasoning context
<span className="muted">{getRecommendationLabel(item.priceRecommendation)}</span>
<p>{item.action}</p>
```

The `marketContext` and `ukComplianceNote` fields exist in the data contract but both return `null` in the current pure-JS implementation.

A single disclaimer exists at the bottom of the input form:

> *"Popularity is estimated from relative price — cheaper items typically sell more."*

This is buried, passive, and does not appear near the results where trust decisions are made.

### Assessment
This is the deepest trust problem in the product. Two compounding issues:

1. **The recommendation is asserted, not explained.** Users are told what to do but not why. A restaurant owner who has run their business for 10 years will not take price advice from software unless they can see the logic.

2. **The popularity proxy is a weak heuristic.** The current classification uses `price <= avgPrice → high popularity`. This is a known limitation documented in the code comments but invisible to the user. It means two items with identical real-world sales could receive different classifications purely because one is priced below average.

### Proposed Fix — Three Layers of Trust

**Layer 1 — Show the maths (quick win, no logic changes required)**

All the data needed to explain the classification already exists in `menuAnalysis.js`. Surface it in `ItemCard.jsx` beneath each item:

> *"Your contribution margin is $9.60. Your menu average is $8.20. Because yours is above average, this item is classified as **high-margin**."*

This requires no new computation — only a display change in `ItemCard.jsx`.

**Layer 2 — Cite the academic framework (credibility, one line of UI)**

The Kasavana & Smith (1982) framework is the industry standard for menu profitability analysis, first published at Cornell University's School of Hotel Administration. This citation is already referenced in `perplexity.md` and `docs/01-problem-research.md` but is invisible to end users.

Add a persistent, non-intrusive attribution line on the results page:

> *"Analysis based on the Kasavana & Smith (1982) menu engineering framework — the industry standard since Cornell University."*

**Layer 3 — Move and reframe the popularity caveat**

Move the popularity proxy disclaimer from the bottom of the input form to the results page, as a visible-but-honest caveat adjacent to the matrix:

> *"⚠️ Popularity is estimated from price position (cheaper items typically sell more). For higher accuracy, add weekly cover counts per item — coming in a future update."*

This does two things simultaneously: it is honest (which builds trust), and it seeds the next premium feature (real sales data input).

---

## Prioritised v2 Backlog

| Priority | Feature | Linked Feedback | Effort Estimate |
|---|---|---|---|
| 🔴 P0 | Resolve LLM vs. pure-JS architecture decision | Prerequisite | 1 hr decision |
| 🟠 P1 | Restaurant-type selector → benchmark food cost % pre-fill | Feedback 1 | Small |
| 🟠 P1 | Show calculation reasoning in ItemCard + cite Kasavana & Smith | Feedback 3 | Small |
| 🟠 P1 | Move popularity caveat to results page | Feedback 3 | XS |
| 🟡 P2 | Ingredient cost calculator toggle (raw cost → auto %) | Feedback 1 | Medium |
| 🟡 P2 | Menu photo scan via Claude Vision → auto-populate rows | Feedback 2 | Medium |
| 🟡 P2 | Stripe payment gate (stub already in `PdfDownloadButton.jsx`) | Monetisation | Small |
| 🟢 P3 | Real popularity input (weekly covers per item) | Feedback 3 | Medium |
| 🟢 P3 | USDA AMS ingredient cost feed (replaces marketContext null) | Data quality | Large |
| 🟢 P3 | Recipe builder (per-item ingredient list) | Feedback 1 | Large |
| ⬜ P4 | Saved reports (Supabase, post paying-user threshold) | Roadmap | Large |

---

## v1 Definition of Done — Status Update

```
- [x] Tool live at a public Vercel URL
- [x] Works on mobile browser (iPad/iPhone)
- [x] US mode: full matrix + PDF + sortable table
- [x] UK mode: DMCCA 2024 compliance notes per item  ← NOTE: currently null in pure-JS build
- [ ] At least 1 real user has used it
- [ ] At least 1 post in a hospitality community (r/restaurantowners, BigHospitality.co.uk)
```

Community post remains the last unchecked v1 item. It should be completed before v2 development begins to validate the core product with a broader audience.

---

*This document was produced by the product owner on 5 April 2026 based on initial user feedback sessions. It supersedes the informal notes in `CLAUDE.md` under "Next Session — Post-v1 Priorities".*
