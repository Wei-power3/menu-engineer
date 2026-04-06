# Menu Engineer — Product Backlog

> **Single source of truth for all planned work.**
> Feedback rationale lives in `docs/04-user-feedback-and-v2-proposal.md`.
> Session-level research lives in `docs/06-user-research/`.

**Last updated:** 6 April 2026

---

## Sprint Status

| Sprint | Theme | Status |
|---|---|---|
| Week 1 | Trust & credibility | ✅ Done |
| Week 2 | Remove input barrier | ✅ Done |
| Week 3 | Bug fixes + revenue + trust copy | 🔨 Next |
| Week 4+ | Market-aware analysis (v3) | 📋 Planned |

---

## ✅ Done

| Issue | Feature | Commit | Sprint |
|---|---|---|---|
| #3 | Per-item reasoning line in ItemCard (CM vs avg, price vs avg) | `83b193c` | Week 1 |
| #4 | Kasavana & Smith (1982) citation on results page | `83b193c` | Week 1 |
| #5 | Popularity proxy caveat moved to results page | `83b193c` | Week 1 |
| — | Restaurant-type selector → benchmark food cost % pre-fill | `b7a9c0c` | Week 2 |
| — | Ingredient cost calculator toggle (raw cost → auto %) | `b7a9c0c` | Week 2 |
| — | Menu photo scan via Gemini 2.5 Flash-Lite → auto-populate rows | `b7a9c0c` + `830f653` | Week 2 |
| — | “Analyse another menu” reset flow | `b7a9c0c` | Week 2 — validated working |

---

## 🔨 Week 3 — Bug Fixes + Revenue + Trust Copy

### 🔴 P0 Bugs (fix before next user test)

| Feature | Notes | Source |
|---|---|---|
| **Sticky Analyse CTA when 5+ rows in form** | Analyse button hidden below fold. Add fixed bottom bar visible at all times once 1+ valid rows exist. Disappears after analysis runs. | Michael E. |
| **New rows inherit selected benchmark %** | `addRow()` reads `FOOD_COST_BENCHMARKS[selectedType]?.pct`. New rows show benchmark value, not 40% hardcode. | Michael E. |

### 🔴 P0 Non-code

| Feature | Notes | Source |
|---|---|---|
| **Post in r/restaurantowners + BigHospitality.co.uk** | No-code. Last unchecked v1 DoD item. Do today. | v1 DoD |
| **Stripe gate on real sales volume input** | Volume input is the premium feature. Gating it creates pull, not friction. | 7th Street research |

### 🟠 P1 (same sprint)

| Feature | Notes | Source |
|---|---|---|
| **Blank gap at top of Puzzles card** | Filter null items before render. Check `:first-child` top margin. | Michael E. |
| **Real sales volume input (weekly covers per item)** | Single strongest trust unlock for scaled operators. The paid feature. | 7th Street research |
| **Empty state copy for Zero Stars / Zero Dogs** | Zero Stars is systemic — default output without volume data. GM copy: *“No Stars yet. This means no item is both high-margin and high-volume — either a pricing opportunity or a data gap.”* | 7th Street + Michael E. |
| **Vary recommendation copy by item rank/type** | Confirmed by 3 independent users. $0.73 sauce and $9.94 combo must not receive identical advice. Vary by margin rank within quadrant + item price tier. | All 3 sessions |

---

## 📋 Week 4 — Polish & UX

| Priority | Feature | Notes | Source |
|---|---|---|---|
| 🟡 P2 | **Drag/drop + clipboard paste for menu photo scan** | Desktop progressive enhancement. Keep file picker + camera as primary. Add drop zone + `ctrl+v` paste. | UX feedback |
| 🟡 P2 | **Privacy note near scan button** | *“Photos are never stored — processed instantly and discarded.”* | Internal |
| 🟡 P2 | **Price-floor-aware recommendation tone for sub-$2 items** | *“Consider raising price — but weigh against brand positioning.”* | 7th Street research |
| 🟢 P3 | **Remember last-used restaurant type across sessions** | localStorage optional convenience. Low priority until retention matters. | Michael E. |

---

## 🌍 Week 5+ — Market-Aware Analysis (v3)

> Full spec in [GitHub Issue #6](https://github.com/Wei-power3/menu-engineer/issues/6).

| Priority | Feature | Data source | Cost | Effort |
|---|---|---|---|---|
| 🟢 P3 | Zip/postcode field at onboarding | — | Free | XS |
| 🟢 P3 | Neighbourhood price benchmarking | Google Places API | ~$0.02/query | Medium |
| 🟢 P3 | Ingredient cost trend feed | USDA AMS API | Free | Medium |
| 🟢 P3 | Seasonal price alerts | USDA AMS historical | Free | Small |
| 🟢 P3 | Tariff impact alerts | USDA AMS + hardcoded table | Free | Small |
| 🟢 P3 | UK ingredient trends | AHDB API | Free | Small |
| 🟢 P3 | Bundle / combo analysis | Internal logic + new data model | Free | Large |

---

## ⬜ Deferred (Post Revenue Threshold)

| Feature | Trigger to revisit | Source |
|---|---|---|
| Saved reports (Supabase) | 50+ paying users | Roadmap |
| Recipe builder (per-item ingredient list) | Paying users request it | Feedback 1 |
| UK DMCCA compliance notes per item | UK user base established | v1 DoD |
| Migrate to Firebase App Hosting | Vercel paid tier becomes relevant | Infrastructure |

---

## Definition of Done — v1 (for reference)

```
- [x] Tool live at a public Vercel URL
- [x] Works on mobile browser (iPad/iPhone)
- [x] US mode: full matrix + PDF + sortable table
- [x] UK mode: market toggle present (DMCCA notes deferred to v3)
- [x] At least 1 real user has used it
- [ ] At least 1 post in a hospitality community  ← do today
```
