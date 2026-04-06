# User Research Report — 7th Street Burger

> **Prepared by:** Product Owner (Weiche Lin)
> **Date:** 6 April 2026
> **Raw feedback:** `raw-feedback.md` (same folder)
> **Backlog changes:** `docs/05-backlog.md`

---

## Session Context

- **Chain:** 7th Street Burger — fast-casual US burger chain
- **Scale:** 26 locations, PE-backed, POS system: Toast
- **Menu tested:** 8 items (Cheeseburger, Double, Impossible Veg, Double Veg, Fries, Water, Mexican Coke, Sauce)
- **Settings used:** QSR / Fast Casual benchmark, US market, photo scan to populate
- **Session type:** Independent, unsolicited — both users ran the tool themselves

---

## Participant Profiles

| | Respondent 1 | Respondent 2 |
|---|---|---|
| **Role** | Owner | General Manager |
| **Scope** | 26 locations, PE-backed | Single location, reports to regional |
| **Data access** | Full P&L, Toast POS | Operational data, regional reviews |
| **Tech comfort** | High (strategic) | High (operational) |
| **Primary device** | Mobile (on the floor) | Mobile + desktop |
| **Verdict** | 7/10 | Implicit ~7/10 |

Two users, same chain, same menu, different seniority. Their findings are strikingly consistent — this strengthens confidence in the signal.

---

## What They Tested

Both users ran the full flow independently:
1. Photo scan → 8 items auto-populated correctly
2. QSR / Fast Casual benchmark pre-fill for food cost %
3. One-click analysis → Stars/Puzzles/Plowhorses/Dogs matrix
4. Price Adjustment Map review

Neither user added real sales volume data (not yet available in the tool).

---

## Findings by Theme

---

### Theme 1 — Photo Scan ✅

**Severity:** Positive validation

> *"Genuinely useful... time-saving shortcut an operator like me actually values."* — Owner
> *"Already saving me time vs. manually typing everything in."* — GM

**PO interpretation:** The scan feature landed exactly as intended. Both users led with it as the most immediately valuable part of the product. On a tight 8-item menu it worked flawlessly. Larger menus (30+ items) remain untested.

**Backlog implication:** None. Validate at scale when more users report in.

---

### Theme 2 — Framework Credibility ✅

**Severity:** Positive validation

> *"Solid, established framework. It's been around since 1982 for a reason."* — Owner
> *"Legit framework, not guesswork... something I can defend to HQ."* — GM

**PO interpretation:** The Kasavana & Smith citation (Week 1 fix) is doing its job. The academic grounding is visible and trusted by operators who would otherwise be sceptical of software advice.

**Backlog implication:** None. Hold this.

---

### Theme 3 — Popularity Heuristic ⚠️ CRITICAL

**Severity:** Critical — affects classification accuracy for anchor items

> *"My Cheeseburger at $6.50 is probably my highest-volume item — the whole brand is built on it. The tool is calling it a 'Puzzle' because its price is above the menu average. That's backwards from reality."* — Owner
> *"The Double and the Cheeseburger are probably our top sellers. Calling them 'Puzzles' could be misleading."* — GM

**PO interpretation:** The price-position heuristic (`price > avgPrice → low popularity`) is a known limitation but its real-world impact is more damaging than anticipated. For chains built around a flagship item priced above menu average, the flagship systematically misclassifies as a Puzzle. This is the single biggest credibility risk for scaled operators.

This is not a bug — the tool correctly discloses the limitation. But the disclosure is not enough when the misclassification hits the item that defines the brand.

**Backlog implication:**
- **Promotes existing item to P1:** Real sales volume input (weekly covers per item)
- **New immediate fix (XS):** Warning on Puzzles quadrant when no volume data is present — *"Items priced above menu average are estimated as lower popularity. This may not reflect reality for anchor items. Add weekly covers to override."*
- **New monetisation angle:** Volume input is the premium feature. Gate it behind the paid tier.

---

### Theme 4 — Empty State Copy ⚠️ MODERATE

**Severity:** Moderate — missed opportunity on the most important output signal

> *"Zero Stars is the most important number on the page, and the tool doesn't comment on it at all. It should say: 'You have no Stars — this means no item is both high-margin and high-volume. This is either a pricing opportunity or a data gap.'"* — GM
> *"Zero Dogs is good news but the tool just says 'No items in this category.'"* — GM

**PO interpretation:** Empty quadrants are not edge cases — for most menus analysed without real volume data, zero Stars will be common. The tool going silent on its most important finding is a design failure. The GM's suggested copy is better than anything currently in the codebase and should be used verbatim.

**Proposed copy changes (zero code, just text):**

*Zero Stars:*
> *"No Stars yet. This usually means your highest-margin items aren't also your highest-volume items — or popularity is estimated. Add weekly sales volumes to get an accurate picture."*

*Zero Dogs:*
> *"Clean menu — no low-margin, low-popularity items to cut. That's a good sign."*

**Backlog implication:** New item, P1, XS effort — copy change only in `AnalysisMatrix.jsx` or equivalent.

---

### Theme 5 — Template Recommendations ⚠️ MODERATE

**Severity:** Moderate — confirmed by both users independently

> *"All four burgers getting the same 'Hold price / Move it higher' recommendation feels templated."* — Owner
> *"Same formula copy-pasted for all four burger items."* — GM

**PO interpretation:** This was flagged as a risk in the architecture decision to remove the LLM. Template strings in `menuAnalysis.js` produce identical action text for items in the same quadrant. Two users on the same menu, independently, used the word "templated" or equivalent. This is a confirmed UX problem.

The fix is not restoring the LLM — it's writing smarter templates that vary by item rank within the quadrant (e.g. highest-margin Puzzle vs. lowest-margin Puzzle get different copy) and by item type heuristic (beverages, sides, proteins handled differently).

**Backlog implication:** New item, P1, Small effort — extend template logic in `menuAnalysis.js` to vary by item rank and price tier within each quadrant.

---

### Theme 6 — Brand Context Blindness ⚠️ MODERATE

**Severity:** Moderate — limits actionability for branded operators

> *"Raising water by $1–2 would push it to $3–4 — that's a brand signal. We built 7th Street on value and accessibility."* — Owner
> *"'Raise by $1–2' on Sauce means tripling the margin but also potentially making it a friction point at checkout."* — GM

**PO interpretation:** The tool cannot know brand positioning, value promise, or channel context (digital menu board, delivery app, dine-in). For low-price anchor items (water, sauce, kids items) the "raise price" recommendation will always conflict with brand intent for value-positioned operators.

This is partially addressed by the volume input feature (the tool would reclassify these items once real data shows they are high-volume) but also requires a softer recommendation tone for extreme-low-price items.

**Backlog implication:** New item, P2 — add price-floor awareness to template logic. Items priced below $2.00 should receive a softer recommendation: *"Consider raising price — but weigh against brand positioning and customer perception."*

---

### Theme 7 — Bundle / Combo Logic 💡 NEW FEATURE

**Severity:** Low (missing feature, not a bug) — but high strategic value for QSR/fast-casual segment

> *"In fast-casual, the real margin play is often combo logic — Burger + Fries + Drink. This tool looks at items in isolation. If Fries and Mexican Coke are both Plowhorses individually, bundling them with a high-margin burger could shift the whole picture."* — GM

**PO interpretation:** Correct and insightful. Menu engineering in QSR has always included combo/bundle analysis as a second layer above item-level analysis. This is a meaningful v3+ feature — it requires a new data model (bundle definitions) and a new analysis layer. It does not conflict with anything currently built.

**Backlog implication:** New item, P3, Large effort — deferred to v3+. Particularly relevant for QSR and fast-casual segments.

---

## Segment Insight

This session confirmed that the product serves two distinct segments with different needs and different willingness to pay:

| Segment | Profile | Current fit | Upgrade trigger | WTP |
|---|---|---|---|---|
| **Solo / early-stage** | First menu, no POS, <3 locations | ✅ Strong | — | $5–10/report |
| **Scaled operator** | Multi-location, Toast/Square POS, PE-backed | ⚠️ Good start | Real volume input | $50–200/mo |

**The freemium architecture follows naturally:**
- **Free:** Price-position heuristic analysis + PDF export
- **Paid:** Real volume input (weekly covers) → accurate Stars/Plowhorses split + CSV export + priority recommendations

This is a stronger monetisation story than gating the PDF. The scaled operator segment has the budget and the motivation — they just need the one feature that makes the tool trustworthy for operational decisions.

---

## Backlog Changes Triggered

| Item | Change | Priority | Effort | Rationale |
|---|---|---|---|---|
| Real sales volume input (weekly covers) | **Promoted P2 → P1** | P1 | Medium | Both users named it as the single feature that unlocks trust. Also the paid tier gate. |
| Empty state copy (Zero Stars / Zero Dogs) | **New item** | P1 | XS | GM provided exact copy. Zero-code fix with high impact. |
| Template recommendation variation by rank/type | **New item** | P1 | Small | Confirmed by both users independently. Variation by item rank within quadrant. |
| Price-floor soft recommendation (<$2 items) | **New item** | P2 | Small | Brand context blindness on value anchor items (water, sauce). |
| Bundle / combo analysis | **New item** | P3 | Large | Valid QSR feature, requires new data model. Deferred to v3+. |
| Stripe gate on **volume input** (not PDF) | **Scope change** | P0 | Small | Volume input is the premium feature. Gating it creates pull, not friction. |

---

## Open Questions

1. **Is bundle logic relevant outside QSR?** The combo angle is specific to fast-casual. Fine dining and independent restaurants may not need it. Need 1–2 sessions with non-QSR operators before scoping.

2. **What is the right paid tier price point?** Owner said $50–200/mo for scaled operators. Solo operators may not pay more than $10/report. Needs a pricing experiment before Stripe gate is built.

3. **How do operators currently track weekly covers?** Toast POS has this data but extracting it may not be trivial for all users. Need to understand the export flow before designing the volume input UX.

4. **Does the tool work on larger menus (30+ items)?** Both users had 8 items. Photo scan accuracy and analysis readability at 30+ items is untested.
