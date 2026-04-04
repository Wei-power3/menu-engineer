# 00 — Meta: Project North Star

## Project Identity

| Field | Value |
|---|---|
| **Project name** | Menu Engineer |
| **Tagline** | Paste your menu. Find out what's bleeding margin, what's underpriced, and what to cut. |
| **Hackathon type** | Solo, 2 days |
| **Start date** | TBD |
| **Definition of done** | Released publicly, real users can access and use it without friction |
| **Monetization goal** | $100/month recurring |
| **Primary market** | United States (v1) |
| **Secondary market** | United Kingdom (v1 toggle) |
| **Status** | Research complete — build not started |
| **Last updated** | April 2026 |

---

## The North Star Statement

> Restaurant owners lose margin every day not because they work hard, but because they price by gut feel.  
> Menu Engineer gives any restaurant owner — in 60 seconds, for free — the same structured analysis a $2,000 menu consultant would deliver.

---

## Definition of Done (for the User)

A restaurant owner pastes or uploads their menu with rough food cost estimates and gets back:

1. Every item plotted on the **Stars / Puzzles / Plowhorses / Dogs matrix** (visual)
2. A **price adjustment map** — which items to raise, hold, or cut
3. **Specific recommended actions** per item, written in plain English
4. A **downloadable PDF report** they can act on immediately

No sign-up. No credit card. Works in a browser. Under 60 seconds.

---

## Key Constraints

- **Solo build** — no team, no delegation
- **48-hour window** — scope must be ruthlessly minimal for v1
- **Shipping > perfecting** — a live tool with rough edges beats a polished prototype nobody can use
- **No POS integration in v1** — all input is manual (owner-provided)
- **No real-time ingredient cost API** — LLM estimation + owner food cost % slider

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

---

## What Success Looks Like at 48 Hours

- [ ] Tool is live at a public URL
- [ ] At least 1 person who is not me has used it
- [ ] At least 1 post/share in a hospitality community (Reddit, Facebook group, or forum)
- [ ] Output is visually clear enough that someone understands it without instructions
