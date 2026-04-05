# 00 — Meta: Project North Star

## Project Identity

| Field | Value |
|---|---|
| **Project name** | Menu Engineer |
| **Tagline** | Paste your menu. Find out what's bleeding margin, what's underpriced, and what to cut. |
| **Hackathon type** | Solo, 2 days |
| **Start date** | April 2026 |
| **Definition of done** | Released publicly, real users can access and use it without friction |
| **Monetization goal** | $100/month recurring |
| **Primary market** | United States (v1) |
| **Secondary market** | United Kingdom (v1 toggle) |
| **Status** | ✅ v1 shipped — April 2026 |
| **Last updated** | April 2026 |

---

## The North Star Statement

> Restaurant owners lose margin every day not because they work hard, but because they price by gut feel.  
> Menu Engineer gives any restaurant owner — in 60 seconds, for free — the same structured analysis a $2,000 menu consultant would deliver.

---

## Definition of Done (for the User)

A restaurant owner pastes their menu with rough food cost estimates and gets back:

1. Every item plotted on the **Stars / Puzzles / Plowhorses / Dogs matrix** (visual)
2. A **price adjustment map** — which items to raise, hold, or cut
3. **Specific recommended actions** per item, written in plain English — including a rough market price context line per item (e.g. "Casual-dining burgers in the US typically range $14–18. Your item at $11 is below market.")
4. A **downloadable PDF report** they can act on immediately

No sign-up. No credit card. Works in a browser. Under 60 seconds.

✅ All four outputs are live in v1.

### v1 Known Limitation

v1 output is a **diagnosis tool**, not a full conviction tool. Research (see `02-benchmark-data-research.md`) confirms that internal-only analysis surfaces the problem but does not reliably trigger repricing action on its own. The market-context line in item #3 above is a lightweight mitigation — Claude uses its training knowledge to add a rough external reference, but this is not live local data.

Full conviction requires external benchmarks (Phase 2+). See the phased roadmap below.

---

## Key Constraints

- **Solo build** — no team, no delegation
- **48-hour window** — scope must be ruthlessly minimal for v1
- **Shipping > perfecting** — a live tool with rough edges beats a polished prototype nobody can use
- **No POS integration in v1** — all input is manual (owner-provided)
- **No real-time ingredient cost API in v1** — Claude's training knowledge provides rough market context per item; USDA AMS live data is Phase 2

---

## Decision Log

| Date | Decision | Rationale |
|---|---|---|
| Apr 2026 | Chose menu engineering over 7 other ideas | Structured data output (not text-in/text-out), clear monetization path, real documented pain |
| Apr 2026 | US as primary market (v1) | Larger community for distribution, richer LLM training data, faster path to $100/month |
| Apr 2026 | UK as day-2 toggle | CMA service charge legislation = urgent forcing function, clear gap, same engine |
| Apr 2026 | Dropped DE for v1 | Data ecosystem too thin, low digital community penetration, complex language barrier |
| Apr 2026 | Owner-provided food cost % (not live API) | Wholesale ingredient cost APIs don't exist at needed precision; owner % is more accurate anyway |
| Apr 2026 | Free with pay-per-report model | Zero friction for discovery; monetise only users who want to save/share output |
| Apr 2026 | Claude training data as v1 market context | Adds lightweight external anchor per item at zero build cost; USDA AMS replaces this in Phase 2 |
| Apr 2026 | USDA AMS deferred to Phase 2 (not v1) | Free, legally clean, weekly commodity data — high-value but outside the 48-hour window |
| Apr 2026 | Stripe payment gate deferred post-v1 | Ship free first, validate real usage, then gate PDF download |

---

## What Success Looks Like at 48 Hours

- [x] Tool is live at a public URL
- [ ] At least 1 person who is not me has used it
- [ ] At least 1 post/share in a hospitality community (Reddit, Facebook group, or forum)
- [x] Output is visually clear enough that someone understands it without instructions

---

## Phased Roadmap (post-v1)

Research finding: *"Internal analysis finds the problem; external benchmarks create conviction to act."* v1 delivers the diagnosis. The phases below add conviction.

| Phase | What's added | Data source | Build cost | Status |
|---|---|---|---|---|
| **v1** | Internal matrix + Claude market-context line per item | Claude training knowledge (rough) | ✅ In scope | ✅ Shipped |
| **Phase 2** | Weekly ingredient cost trends per item ("beef up 6% this month") | USDA AMS API — free, no key, legally clean | Low | ⏳ Next |
| **Phase 3** | Local price range per category built from user-uploaded competitor menus | User provides (no scraping liability) | Medium | ⏳ Pending |
| **Phase 4** | Live district-level competitor pricing | Datassential / RMS (licensed) | High — only if paying users justify cost | ⏳ Pending |

Phase 2 is the highest-value next step after v1 ships. It costs nothing in data licensing and directly addresses the research finding that cost-side signals (not just internal margin) are what trigger operator action.
