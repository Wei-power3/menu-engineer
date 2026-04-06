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
| Week 3 | Revenue + trust fixes for scaled operators | 🔨 Next |
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

---

## 🔨 Week 3 — Revenue + Trust Fixes

| Priority | Feature | Notes | Source |
|---|---|---|---|
| 🔴 P0 | **Post in r/restaurantowners + BigHospitality.co.uk** | No-code. Last unchecked v1 DoD item. Do today. | v1 DoD |
| 🔴 P0 | **Stripe gate on real sales volume input (not PDF)** | Scope change after 7th Street research. Volume input is the premium feature that scaled operators care about. | 7th Street research |
| 🟠 P1 | **Real sales volume input (weekly covers per item)** | Promoted from later backlog. Single strongest trust unlock for scaled operators. | 7th Street research |
| 🟠 P1 | **Empty state copy for Zero Stars / Zero Dogs** | Add explicit guidance when quadrants are empty. GM provided near-final copy. | 7th Street research |
| 🟠 P1 | **Vary recommendation copy by item rank/type** | Reduce templated feel. Different advice for top vs. bottom items within a quadrant; beverages/sides softer than burgers. | 7th Street research |

---

## 📋 Week 4 — Polish & UX

| Priority | Feature | Notes | Source |
|---|---|---|---|
| 🟡 P2 | **Drag/drop + clipboard paste for menu photo scan** | Desktop progressive enhancement. Keep file picker + camera as primary (best on mobile). Add drop zone UI around scan button. Clipboard paste (`ctrl+v`) for screenshot workflow. | UX feedback 6 Apr |
| 🟡 P2 | **Privacy note near scan button** | One line: *"Photos are never stored — processed instantly and discarded."* | Internal |
| 🟡 P2 | **"Analyse another menu" reset flow** | Clear restart path after viewing results. | UX |
| 🟡 P2 | **Price-floor-aware recommendation tone for sub-$2 items** | For water, sauce, etc: *"Consider raising price — but weigh against brand positioning and customer perception."* | 7th Street research |

---

## 🌍 Week 5+ — Market-Aware Analysis (v3)

> Full spec in [GitHub Issue #6](https://github.com/Wei-power3/menu-engineer/issues/6) and `docs/04-user-feedback-and-v2-proposal.md` → Feedback 4.

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
- [ ] At least 1 real user has used it  ← now effectively true, update when desired
- [ ] At least 1 post in a hospitality community  ← do today
```
