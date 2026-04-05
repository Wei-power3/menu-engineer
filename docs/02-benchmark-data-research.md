# 02 · Benchmark Data & External Reference Research

**Date:** 2026-04-05  
**Authored by:** Perplexity deep-research session  
**Status:** Research complete — product implications extracted

---

## Overview

This document records the deep-research findings for the following core hypothesis:

> *A menu engineering tool is only meaningfully actionable if it benchmarks against external data — not just the owner's own numbers in isolation.*

Seven supporting research questions are answered below across four areas:
- Benchmark data availability (Q1–Q2)
- User behaviour and decision-making (Q3–Q4)
- Technical and legal feasibility (Q5–Q6)
- Strategic "done" threshold (Q7)

---

## Hypothesis Verdict

The hypothesis survives research in a **refined form**. Internal-only analysis can be useful, but it is not reliably sufficient to trigger pricing action. External reference data materially increases the likelihood that an operator actually moves on a recommendation.

| Test | Verdict | Reasoning |
|---|---|---|
| Internal-only analysis produces useful insights | ✅ Yes | Menu engineering literature supports profitability analysis from contribution margin and popularity data alone. |
| Internal-only analysis reliably triggers pricing action | ⚠️ Not consistently | Operators face price thresholds and customer-sensitivity concerns that make action harder without an external anchor. |
| External benchmarks materially improve actionability | ✅ Yes | Competitive-market information studies show outside benchmarks increase confidence and sharpen targeting. |
| Full automated district benchmarking required on day one | ❌ No | A lighter benchmark layer still adds value; the expensive part is continuously refreshed local competitor pricing. |

**Refined product thesis:**  
> *Internal analysis finds the problem; external benchmarks create conviction to act.*

---

## Q1 — District-level menu pricing data availability

### Is it publicly accessible or purchaseable?

Granular menu pricing data for US markets **exists commercially** but is largely behind enterprise subscription paywalls, not freely accessible.

**Commercial sources:**
- **Datassential Price Monitor** — captures 90,000+ location-specific restaurant menus monthly; supports local competitor comparisons over time. Aimed at enterprise clients.
- **Revenue Management Solutions (RMS)** — markets a competitor price intelligence product covering ~170,000 restaurant locations, with in-store and delivery prices by US region or market; monthly update frequency.
- **Technomic Pricing Practice** — tracks competitor pricing by market, supports local price analysis. Enterprise pricing.

**Public/low-cost sources:**
- **Yelp Fusion API** — exposes business-level metadata (name, location, rating, coarse price tier like `$` or `$$`). Does **not** provide normalized, bulk item-level menu pricing.
- **Google Places API** — returns menu links or menu highlights for some listings but is not a reliable bulk item-price API.
- **Delivery platforms (DoorDash, Uber Eats)** — menu data is technically accessible on public-facing pages, but no official developer API exposes it for bulk commercial use, and anti-scraping measures are aggressive (see Q6).

**Bottom line for a solo build:** District-level pricing data is available, but mostly through expensive or restricted channels. Low-cost automated benchmarking is not achievable without legal and cost trade-offs.

### Refresh frequency and geographic granularity

| Source | Granularity | Refresh frequency | Access model |
|---|---|---|---|
| Datassential Price Monitor | Location-level | Monthly | Commercial subscription |
| RMS Competitor Intelligence | US region / market | Monthly | Commercial subscription |
| Yelp Fusion API | City-level (price tier only) | Near real-time | Free (rate-limited, ToS-restricted) |
| Google Places | Varies by listing | Near real-time | Paid per call |
| DoorDash / Uber Eats (scrape) | Item-level | As scraped | ⚠️ ToS violation risk |

---

## Q2 — Weekly ingredient-cost indices

### USDA AMS Market News (recommended)

The strongest public source for weekly ingredient costs is **USDA AMS Market News**, not BLS PPI.

USDA AMS publishes 1,500+ reports and datasets, updated **2,000+ times per week**, covering:
- Livestock (beef, pork)
- Poultry
- Dairy and eggs
- Specialty crops and produce

Developer-accessible via the **USDA MARS API** (free, no API key required for most endpoints). This is a viable, legally clean, near-real-time data source for building a "past 1 week ingredient cost" feature.

### BLS Producer Price Index (not recommended for this use case)

BLS PPI is **monthly**, based on prices reported as of the week containing the 13th of each month. It does not support a "past 1 week" signal. The PPI is appropriate for trend analysis over quarters, not weekly cost monitoring.

### Commercial feeds

Urner Barry provides aggregated current-month chicken, egg, and seafood price data used by the BLS PPI office — evidence that a paid real-time commercial data layer exists for proteins and seafood. Subscription cost is enterprise-level.

**Bottom line:** Weekly ingredient-cost data **is viable** via USDA AMS for most commodity categories. BLS PPI is too slow and too aggregated. USDA AMS is the recommended starting point for a solo builder.

---

## Q3 — What actually triggers independent operator price changes?

### Primary trigger: internal cost pressure

Survey evidence from a 2025 study of small restaurants during high inflation found:
- **Cost-based pricing** was the most commonly used strategy.
- Higher costs had a **stronger influence** on price changes than cost decreases.
- Price *reviews* happened more frequently than actual price *changes* — operators reconsider frequently but hesitate to act.
- Competition-based pricing mattered, but not as strongly as internal cost increases.
- **Pricing thresholds and information-gathering costs delayed action.**

National Restaurant Association data reinforces this: elevated food, labor, and debt burdens drove broad menu price increases, framed explicitly as cost-recovery moves rather than competitive repositioning.

### Role of competitor benchmarks

Competitor pricing functions mainly as a **permission structure** or confidence check — it tells an operator "the market will bear this" — rather than as the primary initial trigger for a price change. The owner usually already knows their costs are up; what they are uncertain about is whether customers will accept a higher price. A benchmark helps answer that uncertainty.

### Implication for the product

The scan-and-upload tool can surface the problem. The benchmark helps operators act on it. Both components matter for a complete action path.

---

## Q4 — Minimum benchmark for credibility

No clean peer-reviewed standard exists, but behavioral pricing research supports a clear product direction: **an anonymized average alone is weaker than a bounded range plus named comparable examples.**

Key findings:
- Reference prices strongly shape decision-making; acceptance of a price change depends partly on how it compares with a salient reference point.
- Fairness perception matters: price increases feel more justified when operators can point to competitors or cost inputs, not just internal margin targets.
- A local **range** is more persuasive than a single average.
- One or more **named comparable restaurants** ("similar items at nearby casual-dining restaurants") outperform an opaque "market average."

**Recommended benchmark frame:**

> "Your chicken sandwich is priced 12% below the local range for similar items ($11–$15). Your food cost on this item increased 6% over the past month."

This framing combines:
1. A **local price range** (floor + ceiling, not just a mean)
2. A **directional cost signal** (from USDA AMS or internal cost entry)
3. A **plain-language gap** (percentage below range)

The benchmark is most useful as a **floor and range detector**, not a hard target price. Operators want to avoid leaving margin on the table while staying within customer tolerance.

---

## Q5 — Competitive tools with live external data

### Enterprise tools (confirmed)

| Tool | External data used | Data source | Access |
|---|---|---|---|
| Datassential Price Monitor | 90,000+ location-specific menu prices | Proprietary scraping + partnerships | Enterprise subscription |
| Revenue Management Solutions | 170,000 restaurant locations, in-store + delivery pricing | Proprietary | Enterprise subscription |
| Technomic Pricing Practice | Competitor prices by market | Proprietary | Enterprise subscription |

### Lightweight / SMB tools

No verified evidence found that Piemetrics, MyMenu.AI, or similar lightweight scan-based tools publicly disclose live external benchmarking feeds or named data providers. The pattern observed is:
- Lightweight tools emphasize **internal costing, recipe costing, or OCR/menu parsing**.
- **Richer competitive intelligence is concentrated in enterprise or consulting-led products.**

**Conclusion:** External live benchmarking exists in the market but is mostly an enterprise feature, not a standard capability of no-POS lightweight menu tools. This represents a gap the product can exploit at the SMB tier.

---

## Q6 — Legal and ToS constraints on scraping

### CFAA exposure after *hiQ v. LinkedIn*

The Ninth Circuit (post-*Van Buren*, 2022) held that scraping **publicly accessible** data is less likely to constitute "without authorization" under the CFAA. This narrows — but does not eliminate — federal criminal and civil exposure for scraping publicly visible restaurant menu pages.

**Key qualifier:** This only applies when the data is genuinely public. If a page requires login or account creation to view, scraping likely remains a CFAA risk.

### Contractual / ToS exposure

Even where CFAA risk is reduced, platform ToS restrictions remain enforceable as contract claims:

| Platform | ToS stance on scraping | Notes |
|---|---|---|
| **Yelp** | Explicitly prohibited — Section 6(b) bars bots, crawlers, scrapers, or any automated extraction for any purpose | Yelp's own support articles confirm this directly |
| **Google** | Prohibited under Maps/Places ToS for bulk commercial extraction | Per-call API pricing for permitted programmatic access |
| **DoorDash** | No official public developer API for menu data; anti-scraping measures active | No clear compliant path for bulk menu pricing |
| **Grubhub / Uber Eats** | Similar restrictions; no official bulk-pricing API |  |

### Recommended approach

For a commercial product, the safest data acquisition paths are:
1. **USDA AMS API** — free, public, legally clean, weekly commodity pricing.
2. **User-supplied competitor menus** — owner uploads or manually links competitor menus; no automated scraping liability.
3. **Licensed data** — paid commercial feeds (Datassential, RMS) if the product proves demand and can support the cost.
4. **Large-scale automated scraping of Yelp/DoorDash** — not recommended as a core commercial dependency due to ToS risk, even if CFAA exposure is reduced.

---

## Q7 — Is quadrant + plain-English action enough?

### The behavioral economics case against internal-only output

Classical menu engineering (Stars / Plowhorses / Puzzles / Dogs) is analytically sound but **reference-dependent decisions are the norm in practice**.

Core findings:
- Kahneman/Tversky prospect theory: people react to gains and losses relative to a reference point, not in absolute terms. "Your item is a Dog" is a relative judgment within your own menu — it does not anchor on anything external.
- Loss aversion in price adjustment research shows that operators are reluctant to raise prices when uncertain about market tolerance, and that awareness of a market reference point materially changes their willingness to act.
- A study on information value in competitive markets found that giving SMEs better market information increased revenue by **4.5–9%** because it revealed previously unexploited opportunities the owner could not see from internal data alone.

### Practical implication

| Output type | Diagnosis provided | Likely to trigger action? |
|---|---|---|
| "Your burger is a Dog" | Item is low-margin and low-popularity | Weakly — owner may already suspect this |
| "Your burger is a Dog and is priced 14% below comparable local items" | Same + market context | More strongly — gives permission to act |
| "Your burger is a Dog, priced 14% below local range, and beef cost rose 6% this month" | Same + cost-side validation | Strongest — dual anchor (market + cost) |

**Conclusion:** The quadrant output diagnoses the problem but does not, on its own, reliably produce the conviction to reprice. External benchmarks — even lightweight ones like USDA cost trends or a rough local range — meaningfully increase the actionability of the recommendation.

---

## Product Roadmap Implication

Based on the research, the recommended phased approach is:

### Phase 1 — Internal MVP (current scope)
- Menu scan / upload
- User-entered or model-estimated food cost
- Contribution margin + popularity → quadrant classification
- Plain-English action per item

**Value:** Useful. Surfaces what is broken. Lower actionability for pricing changes.

### Phase 2 — Add free public ingredient signals
- Integrate USDA AMS API for weekly commodity price trends (beef, chicken, dairy, produce)
- Surface "ingredient cost moved X% this month" alongside item recommendations
- No licensing cost; legally clean; adds the cost-side anchor

**Value:** Strengthens the "why now" for repricing decisions. Low build cost.

### Phase 3 — Add lightweight competitor context
- Accept user-uploaded competitor menus (OCR same pipeline)
- Allow manual entry of 2–3 competitor price points per category
- Show local price range built from user inputs
- No automated scraping; no ToS exposure

**Value:** Adds the "compared to what?" market anchor. Still feasible for a solo build.

### Phase 4 — Consider commercial local feeds (if demand proven)
- Evaluate Datassential, RMS, or similar for licensed district-level pricing
- Only justified if the product has paying users and a margin structure that can absorb data costs

---

## Summary of Research Sources

| Area | Key sources |
|---|---|
| District-level pricing data | Datassential (perishablenews.com, Jun 2025), RMS (qsrmagazine.com, Jun 2023; revenuemanage.com, Feb 2025), Technomic (technomic.com) |
| Ingredient cost indices | USDA AMS / MARS API documentation (mioa.org PDF), BLS PPI FAQ (bls.gov), FRED PCU series |
| Operator pricing behaviour | Aalto University thesis on small restaurant pricing during inflation (2025), National Restaurant Association inflation data (restaurant.org), Restaurant Business Online |
| Behavioral economics | Reference price / loss aversion theory (IZA DP 2016, Sage Journals), Value of information in competitive markets (UChicago Journals 2024), Behavioral response to price (ScienceDirect 2022) |
| Legal / ToS | Proskauer (hiQ Ninth Circuit opinion, 2022), White & Case (hiQ preliminary injunction, 2022), Yelp support centre (scraping policy) |
| Competitive tools | Datassential, RMS, Technomic product pages; "Plates That Pay" launch (newsworthy.ai, Mar 2026) |
