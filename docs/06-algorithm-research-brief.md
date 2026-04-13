# 06 — Algorithm Research Brief

> **For:** External research team (data scientists / algorithm researchers)
> **From:** Weiche Lin, founder — Menu Engineer
> **Date:** April 2026
> **Repo:** [Wei-power3/menu-engineer](https://github.com/Wei-power3/menu-engineer)
> **Status:** Ready for research. No code changes requested yet — research and recommendations first.

---

## 1. What This Product Does

Menu Engineer is a web tool for independent restaurant owners. The owner pastes their menu — item name, selling price, and food cost % — and receives a structured analysis in under 60 seconds. No POS, no sign-up, no consultant.

The output is a **Stars / Puzzles / Plowhorses / Dogs** classification matrix (the Kasavana & Smith menu engineering model, Michigan State University, 1982), plus a plain-English action recommendation per item and a sortable price adjustment table.

**Why this matters:** 412,000 independent US restaurants operate on ~5% pre-tax margins. Food costs rose 35% since 2019. Owners raise prices by gut feel, uniformly, and often too late. This tool gives them a structured decision in 60 seconds, for free.

Full context: [`docs/01-problem-research.md`](./01-problem-research.md)

---

## 2. The Current Algorithm Layer

All analysis logic lives in one file: [`src/utils/menuAnalysis.js`](../src/utils/menuAnalysis.js)

There are **5 algorithms** running today. Here is each one exactly as implemented:

---

### Algorithm 1 — Food Cost Calculation

```
foodCostAmount = price × (foodCostPct ÷ 100)
```

**Status: Sound.** Simple arithmetic. No research needed.

---

### Algorithm 2 — Contribution Margin Calculation

```
contributionMargin = price − foodCostAmount
```

**Status: Sound.** This is the standard definition from Kasavana & Smith and all menu engineering literature. No research needed.

---

### Algorithm 3 — Margin Classification Threshold ⚠️

```
avgCM = arithmetic mean of all items' contribution margins
marginLevel = “high” if item CM ≥ avgCM, else “low”
```

**Status: Weak. Research required.**

The arithmetic mean is used as the threshold to decide whether a dish is “high margin” or “low margin”. This is the simplest possible approach, but it has a known flaw: a single outlier item (e.g. a $60 premium dish on an otherwise $15-average menu) pulls the mean up and causes every other item to be classified as “low margin,” even if they are genuinely profitable.

The original Kasavana & Smith paper (1982) also uses the mean. But academic research since then has proposed alternatives.

**What we need to know:**
- Is arithmetic mean the right threshold, or would median (or another measure) produce more accurate, more stable classifications for typical restaurant menus?
- How sensitive is classification to outlier items, and at what menu size / price spread does it become a real problem?
- Are there published alternatives or improvements to the Kasavana & Smith threshold that have been validated on real restaurant data?

---

### Algorithm 4 — Popularity Proxy ⚠️

```
avgPrice = arithmetic mean of all items' prices
popularityLevel = “high” if item price ≤ avgPrice, else “low”
```

**Status: Weakest algorithm. Research required.**

This is a stand-in for real sales data, which the product does not collect in v1. The assumption is: cheaper items sell more than expensive ones. The file's own comment acknowledges this is a heuristic.

The problem is significant: a $12 Caesar Salad and a $14 Margherita Pizza would both be classified as “popular” on a $14.40 average-price menu — but in reality the salad may outsell the pizza 3:1, or vice versa. The algorithm has no way to know, and assumes they are equivalent.

The original Kasavana & Smith model was designed to use actual sales volume (unit count per item). This product cannot collect that data without POS integration, which is deliberately out of scope for v1.

**What we need to know:**
- What is the best available popularity proxy when no sales data exists? Options in the literature include: menu position (first items sell more), item type (proteins sell more than offal/unusual items), price point (cheaper = more popular), or a scored combination of these signals.
- Has any published research validated a no-sales-data popularity heuristic against real restaurant sales data? If yes, which signals had the highest predictive accuracy?
- What is the practical cost of misclassifying popularity? (i.e. does it matter more to get margin right or popularity right, from an operator decision-making perspective?)
- Could a simple scored model — combining menu position + item category + relative price — outperform the current single-variable proxy?

---

### Algorithm 5 — Quadrant Classification

```
Star      = high margin + high popularity
Puzzle    = high margin + low popularity
Plowhorse = low margin  + high popularity
Dog       = low margin  + low popularity
```

**Status: Sound — dependent on Algorithms 3 and 4.**

This is the direct implementation of the Kasavana & Smith matrix. The logic itself is correct. Its quality is entirely determined by the accuracy of Algorithm 3 (margin threshold) and Algorithm 4 (popularity proxy). No independent research needed here — improving 3 and 4 will automatically improve this output.

---

### Algorithm 6 — Price Recommendation ⚠️

```
Star      → hold
Puzzle    → hold
Plowhorse → raise
Dog       → cut
```

**Status: Functional but blunt. Research required.**

This is a fixed lookup table. The output is one word: `raise`, `cut`, or `hold`. There is no formula, no dollar amount, no consideration of how far above or below market the item sits, and no consideration of how thin or thick the margin is.

For example: two Plowhorses with CMs of $2.00 and $8.50 both receive the same recommendation (“raise”), even though the first is a genuine problem and the second is borderline fine.

The AI layer (Gemini) adds a `marketContext` sentence about typical local price ranges, but this is unstructured text, not a formula, and not connected back to the raise/cut/hold decision.

**What we need to know:**
- What formula or rule-based approach should determine the *magnitude* of a price recommendation — not just direction?
- How do other menu engineering tools or pricing literature approach the question of how much to raise a Plowhorse?
- What external data inputs (if any) would meaningfully improve the recommendation? USDA AMS commodity prices are already planned for Phase 2 — would that be sufficient for a cost-side anchor, or is competitor price benchmarking also needed?
- Is there a defensible, explainable formula that could replace the lookup table and produce something like: “Raise by $1–2 to reach a CM of $X, which would move this item above the menu average.”?

---

## 3. Hard Constraints for Any Proposed Solution

These are non-negotiable. Any research recommendation must be compatible with all of them.

| Constraint | Detail |
|---|---|
| **No sales data** | The only inputs are: item name, selling price (number), food cost % (number). No unit counts, no order history, no POS. |
| **No external API dependency for core analysis** | The deterministic analysis must work offline/client-side. External data (USDA AMS etc.) is acceptable as enrichment only, not as a hard dependency. |
| **Must run in JavaScript** | The analysis module (`menuAnalysis.js`) runs client-side in the browser. Any proposed algorithm must be expressible as simple JS arithmetic — no Python, no ML runtime, no server. |
| **Must be explainable to a non-technical owner** | The restaurant owner sees the output. They must be able to understand *why* an item was classified as a Dog. Black-box models are not acceptable. |
| **Output schema must stay the same** | The JSON contract consumed by the React UI cannot change field names or types. New fields may be added; existing fields must remain. |

---

## 4. What Good Research Output Looks Like

The research team is not being asked to write code. The deliverable is a **research memo** that answers the questions in Section 2 for Algorithms 3, 4, and 6, structured as follows:

### For each algorithm:
1. **Literature review** — What do Kasavana & Smith (1982) and subsequent academic work say? Are there validated improvements?
2. **Recommended approach** — What threshold / formula / scoring model should replace the current implementation?
3. **Justification** — Why is this approach better than what exists today? What evidence supports it?
4. **Plain-English explanation** — How would you explain this algorithm to a restaurant owner with no maths background?
5. **Pseudocode** — A simple step-by-step description of the formula, ready for a developer to implement in JavaScript.
6. **Edge cases** — What inputs would break this algorithm? (Single-item menu, all identical prices, one extreme outlier, etc.)

### Additionally:
7. **Combined system recommendation** — Given that Algorithms 3, 4, and 6 interact (4 feeds into 5, which feeds into 6), is there a better overall classification + recommendation design that should replace all three together? If so, describe it.

---

## 5. Relevant Files to Read

| File | What it contains |
|---|---|
| [`src/utils/menuAnalysis.js`](../src/utils/menuAnalysis.js) | The complete current implementation of all 5 algorithms |
| [`api/analyze.js`](../api/analyze.js) | The Gemini enrichment layer (marketContext + ukComplianceNote) |
| [`docs/01-problem-research.md`](./01-problem-research.md) | User persona, pain points, market size, real owner quotes |
| [`docs/02-benchmark-data-research.md`](./02-benchmark-data-research.md) | External data sources, legal constraints, behavioral economics of pricing |
| [`docs/03-build-plan.md`](./03-build-plan.md) | Full architecture, data flow, JSON contract, post-v1 roadmap |
| [`CLAUDE.md`](../CLAUDE.md) | Master project brief, stack, owner constraints, known weaknesses |

---

## 6. Test Menu for Reference

Use this menu to verify any proposed algorithm produces sensible output:

```
Margherita Pizza, $14, 28% food cost
Truffle Pasta, $22, 35% food cost
House Burger, $16, 40% food cost
Caesar Salad, $12, 22% food cost
Tiramisu, $8, 30% food cost
```

Current output from `menuAnalysis.js` (avgPrice = $14.40, avgCM ≈ $9.58):

| Item | Price | CM | Current Category | Reasonable? |
|---|---|---|---|---|
| Tiramisu | $8 | $5.60 | Plowhorse | Questionable — desserts often have low CM but high volume |
| Caesar Salad | $12 | $9.36 | Plowhorse | Reasonable |
| Margherita Pizza | $14 | $10.08 | Star | Reasonable |
| House Burger | $16 | $9.60 | Puzzle | Questionable — burgers typically outsell pasta |
| Truffle Pasta | $22 | $14.30 | Puzzle | Questionable — highest CM item classified as low popularity purely due to price |

The House Burger and Truffle Pasta classifications illustrate the core weakness of Algorithm 4: a burger priced above the menu average is classified as “unpopular,” which is likely wrong in any real casual-dining setting.

---

## 7. Background on the Kasavana & Smith Model

The Stars / Puzzles / Plowhorses / Dogs matrix was published by Michael L. Kasavana and Donald I. Smith in *Menu Engineering: A Practical Guide to Menu Analysis* (Hospitality Publications, Michigan State University, 1982). It remains the dominant framework in menu engineering literature and professional practice.

The original model requires:
- **Unit sales volume** per item (actual count from POS or manual tracking)
- **Contribution margin** per item (selling price minus food cost)
- A **popularity threshold** based on 70% of the expected average mix (i.e. if there are 10 items, an item is “popular” if it accounts for more than 7% of total covers — which is 70% ÷ 10)
- A **margin threshold** based on the mean CM of the menu

This product currently replaces the unit sales volume with a price-based proxy (Algorithm 4), and uses the mean CM as the margin threshold (Algorithm 3) — consistent with the original model for margin, but a significant departure for popularity.

---

## 8. Questions to the Research Team

1. Is the Kasavana & Smith mean CM threshold still the academic consensus, or has a better threshold been validated?
2. What is the most accurate no-sales-data popularity proxy supported by research?
3. Should popularity and margin be treated as binary (high/low) or would a continuous score produce better operator decisions?
4. What formula would produce a defensible, explainable price adjustment magnitude for Plowhorses and Dogs?
5. Is there a combined design — replacing Algorithms 3, 4, and 6 together — that is materially better than improving each independently?
