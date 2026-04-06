# Usability Report — Michael E.

> **Prepared by:** Product Owner (Weiche Lin)
> **Date:** 6 April 2026
> **Session type:** Two-run usability test (scan flow + manual entry flow)
> **Raw feedback:** `raw-feedback.md` (same folder)
> **Backlog changes:** `docs/05-backlog.md`

---

## Session Context

- **Tester:** Michael E. — fast-casual operator / floor manager perspective
- **Run 1:** Photo scan → 8 items (carried over from prior session)
- **Run 2:** Manual entry → 8 new items (Smash Single, Smash Double, Chicken Tenders, Animal Fries, Loaded Tots, Late Night Combo, Milkshake, Fountain Drink)
- **Device context:** Tablet/phone (floor operator simulation)
- **Settings:** QSR / Fast Food, US market
- **Notable:** First tester to run the full flow twice in one session and specifically test the “Analyse another menu” reset path

---

## Bugs Found (Reproducible)

Three confirmed defects with specific reproduction steps. All are ship-blockers for manual-entry users.

### Bug 1 — CRITICAL: Analyse button hidden below fold

**Steps to reproduce:** Select restaurant type. Add 6+ item rows manually. Observe that the Analyse button is no longer visible without scrolling.

**Impact:** User has no visible affordance that the form is complete and ready to submit. On a phone at a counter, this causes silent abandonment — no error, no feedback, just a stuck user.

**Fix:** Sticky bottom CTA bar that appears when 1+ valid rows exist. Disappears after analysis runs.

**Effort:** XS
**Priority:** P0 — fix before next user test

---

### Bug 2 — CRITICAL: New rows via “+ Add item” don’t inherit benchmark %

**Steps to reproduce:** Select QSR (benchmark: 27%). Observe first 3 rows pre-fill at 27%. Click “+ Add item”. New row shows 40% placeholder instead of 27%.

**Impact:** Silent bad data. A manager who doesn’t notice the inconsistency submits analysis with wrong food cost percentages. Results are incorrect but look valid.

**Fix:** `addRow()` function must read `FOOD_COST_BENCHMARKS[selectedType]?.pct` as default for new rows. One-line fix.

**Effort:** XS
**Priority:** P0 — fix before next user test

---

### Bug 3 — MODERATE: Blank gap at top of Puzzles card

**Steps to reproduce:** Run analysis. Observe Puzzles quadrant card. Empty white space appears above the first item.

**Impact:** Looks like a rendering error. Erodes trust in the tool’s output quality.

**Likely cause:** Null/undefined item being mapped in the Puzzles array, or unwanted top margin on the first child element.

**Fix:** Filter null items before render: `puzzles.filter(item => item && item.name)`. Check `:first-child` top margin.

**Effort:** XS
**Priority:** P1

---

## Usability Findings

---

### Finding 1 — Reset flow works correctly ✅

> *"The reset was instant. Clean slate. No lag, no confirmation dialog. That's the right call."*

**PO interpretation:** The “Analyse another menu” reset is validated. No confirmation dialog is the correct decision for a fast-casual floor context. This finding closes the reset flow backlog item — it works, no changes needed.

**Backlog implication:** “Analyse another menu reset flow” → mark as resolved (was listed as P2 Week 4).

---

### Finding 2 — Restaurant type not persisted across sessions

> *"I had to pick QSR/Fast Food again. If I’m running the same shop every time, that’s one unnecessary click on every session."

**PO interpretation:** First mention of cross-session persistence. The tool currently has no memory by design (no localStorage). Within-session persistence is trivial (the state exists already during a session). Cross-session persistence requires localStorage or backend. Low priority given most users won’t return frequently until the product matures.

**Backlog implication:** New item, P3 — remember last-used restaurant type within session (already works) and optionally across sessions via localStorage.

---

### Finding 3 — Scan remains the killer feature; manual entry is the fallback

> *"The Scan menu feature remains the killer feature here. Manual entry is slow and error-prone. If scan works reliably, most of these friction points disappear."

**PO interpretation:** Michael ran both flows and reached the same conclusion independently as the 7th Street users. The scan feature is the primary path. Manual entry is a fallback for when scan fails or for hypothetical menus. This has implications for investment priority: scan reliability and edge case handling matters more than polishing manual entry.

**Backlog implication:** Reinforces scan-first approach. Drag/drop and clipboard paste (P2 Week 4) become more important as scan enhancements.

---

### Finding 4 — Zero Stars on second independent menu

Michael’s Smash burger menu also returned zero Stars. This is the second distinct menu from a second distinct tester to produce this result.

**PO interpretation:** Zero Stars is systemic, not a 7th Street quirk. With no real volume data, price-position heuristic will classify high-priced items as low-popularity — and high-margin items tend to be high-priced — making zero Stars the expected output for most menus analysed without volume data. The empty state silence is therefore the default experience for most users. This makes the empty state copy fix urgent, not optional.

**Backlog implication:** Confirms Zero Stars empty-state copy as P1. No change to priority, but urgency increases.

---

### Finding 5 — Template recommendations confirmed third time

> *"No differentiation in advice quality between a $0.73 sauce and a $9.94 combo."

**PO interpretation:** Third independent user to flag identical template copy across items of vastly different margin scale. The $9.94 Late Night Combo and the $0.73 Sauce receiving identical advice is the clearest articulation yet of why this matters. The recommendation variation fix is now confirmed by three users across two separate menus.

**Backlog implication:** Recommendation variation by item rank/type remains P1. No change.

---

### Finding 6 — Tool analysis validated on Fountain Drink ✅

> *"The Fountain Drink being flagged as a Plowhorse with a 'Raise price' recommendation is a good catch — drinks are genuinely underpriced in most fast-casual shops. That's an actionable insight."

**PO interpretation:** A credible fast-casual operator independently validated that the core analysis logic produced a correct, actionable insight on a real item. This is evidence that `menuAnalysis.js` is sound. The problem is not the maths — it’s the copy layered on top of it.

**Backlog implication:** None. Confidence in core analysis logic maintained.

---

## Cross-Session Patterns (3 users, 2 menus)

After three usability sessions, these findings have been confirmed by multiple independent users:

| Finding | Sessions | Status |
|---|---|---|
| Scan feature is the primary value | 3/3 | ✅ Strong validation |
| Framework credibility (Kasavana citation) | 2/3 | ✅ Validated |
| Volume data is the trust blocker | 3/3 | 🔴 Critical gap |
| Zero Stars empty state needs copy | 2/2 menus tested | 🔴 Systemic |
| Template recommendations feel identical | 3/3 | 🔴 Confirmed requirement |
| Price table is clean and actionable | 2/3 | ✅ Validated |

---

## Backlog Changes Triggered

| Item | Change | Priority | Effort | Rationale |
|---|---|---|---|---|
| Sticky Analyse CTA when 5+ rows | **New — P0 bug** | P0 | XS | Show-stopper for manual entry. Hidden button = silent abandonment. |
| New rows inherit benchmark % | **New — P0 bug** | P0 | XS | Silent bad data. One-line fix in addRow(). |
| Blank gap in Puzzles card | **New — P1 bug** | P1 | XS | Looks broken. Null filter + CSS fix. |
| “Analyse another menu” reset flow | **Resolved** | — | — | Validated as working correctly. Remove from backlog. |
| Remember last restaurant type | **New item** | P3 | XS | Cross-session convenience. Low priority until retention matters. |

---

## Open Questions

1. **What is scan failure rate in the wild?** Michael noted manual entry is the fallback when scan fails. We don’t yet have data on how often the Gemini Vision scan fails on real menus (handwritten, dark photography, small print).

2. **Does the tool work for non-burger menus?** All three sessions so far are fast-casual burger chains. The framework is universal but the benchmark food cost % and recommendation copy may be calibrated for this segment. Need a fine dining or Italian restaurant session.
