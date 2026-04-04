# 01 — Problem Research

## How We Got Here: Ideation Methodology

**Pass 1 — Feature-first (rejected):** Started with AI capabilities and reverse-engineered problems. Produced "paste text → get text back" ideas. Repeatable pattern, low differentiation, no structured output.

**Pass 2 — Pain-first:** Sourced real complaints from Reddit and operator forums. Better specificity, but still text-in/text-out dominant.

**Pass 3 — Constrained (winner):** Added four hard filters before any idea could advance:
1. Output must be a **structured artifact** (visual, matrix, report, score) — not plain text
2. Input must involve **structured data**, not just free writing
3. Community must be **overlooked by mainstream AI tools**
4. Monetisation path to **$100/month** must be explicit

Menu Engineer cleared all four. Every rejected idea failed at least one.

---

## The Chosen Problem: Menu Engineering

### Pain Statement

Restaurant owners price their menus by gut feel. They know costs are rising — food and labour costs have each gone up 35% since 2019 — but they have no structured way to decide *which items* to raise, *which to protect*, and *which to cut*. The average independent restaurant now operates on a ~5% pre-tax margin, meaning a single mispriced dish can tip a week into the red. Professional menu engineering exists — developed by Kasavana & Smith at Michigan State University in 1982 — but it costs roughly $3,000 per engagement for a single-unit restaurant, and most small owners have never encountered the concept, let alone paid for it.

---

### User Persona: Marco / Maria

> *The independent restaurant owner-operator of a 30–60 cover casual dining restaurant. Running the floor, the kitchen, the ordering, and the books — all simultaneously.*

**Who they are:**
- 7 in 10 US restaurant owners run a single-unit operation
- 8 in 10 started their careers in entry-level restaurant positions
- 33% have a high school diploma or less; 36% were born outside the US
- 79% have children under 18 at home
- 66% of independent operators still carry pandemic-era or operational debt

**How they spend their day:**
They arrive before the kitchen opens, approve the day's prep, handle a supplier complaint, answer an Instagram DM, cover a no-show FOH shift, and close out the till at midnight. Pricing review is something they do "when there's time" — which means quarterly at best, reactively at worst.

**Their relationship with data:**
They track revenue. Some track food cost %. Very few have a structured cost-per-plate calculation for every item. The spreadsheet exists but it's outdated. They know the truffle pasta feels too cheap — but they can't prove it.

**Their relationship with AI:**
85% of US independent operators feel positive about AI in restaurants. They're not anti-technology. They simply haven't found a tool that speaks their language, doesn't require POS integration, and delivers something they can *act on the same day*.

---

### User Story

> *"It's March 2026. Beef tariffs just hit. My protein costs went up 18% overnight. I know I need to raise prices but I don't know where to start without scaring off my regulars. I spent Sunday afternoon on Reddit reading how other owners handled it. Everyone says 'do a menu analysis' but nobody explains how. I wish someone could just look at my menu and tell me what to raise, what to leave alone, and what to cut."*

This is the **cost-shock trigger** — the moment a pricing crisis forces the conversation. It happens when:
- A major ingredient cost spikes (tariffs, supply disruption, seasonal)
- The owner raises everything 10% uniformly and notices volume drop
- A trusted staff member or accountant says "your margins don't add up"

The owner at this moment is ready to act. They are searching Reddit, YouTube, Google. They are in the window. The tool needs to be findable, free to try, and deliver a usable output within 60 seconds.

---

### Real Quotes

**On pricing by guesswork:**

> *"Just because an item is popular doesn't mean it's the most profitable. Uncontrolled ingredient costs can quietly erode your profits. If you're not monitoring the cost per plate, you're merely making assumptions."*
> — r/Restaurant_Managers

> *"After the recession, I delayed increasing prices for too long, and when I finally did, it led to a significant shock for many of my regulars. Consistent, small increases is key."*
> — r/restaurateur

**On the margin crisis:**

> *"To cover higher input costs and maintain its 5% pre-pandemic profit margin, the average restaurant would have to increase prices 30.3%."*
> — National Restaurant Association

> *"91% of restaurant leaders reported food cost increases in 2025. Nearly 80% expect tariffs to impact their business, with many bracing for 10–25% increases in ingredient costs."*
> — Restaurant Dive

**On what structure delivers:**

> *"Menu engineering isn't about guessing which dishes seem to be selling well. Your intuition as a chef is invaluable — menu engineering ensures your creativity is backed by actionable data."*
> — meez

---

### Wished State

> *"I paste my menu with rough food cost estimates and get back a clear visual showing me exactly which items to raise, which to promote, which to rename, and which to kill — in under 60 seconds, without a consultant."*

Specifically, the owner wants:
1. Every item classified as Star / Puzzle / Plowhorse / Dog — with a visual plot
2. A specific recommended action per item in plain English
3. A price adjustment map — concrete numbers, not vague percentages
4. Something printable they can show a business partner or bring to a supplier meeting

They do **not** want: a long article about menu psychology, a 10-step tutorial, a product requiring POS integration, or a sign-up form before they see any value.

---

## Country Research

### 🇺🇸 United States

**Market size:** 412,498 independent restaurant locations as of end of 2025 — down 2.3% YoY, a net loss of 9,500 locations. Closures concentrated in full-service independents — exactly the target user.

**The pressure:**
- Food and labour costs each up 35% since 2019
- 91% of operators experienced food cost increases in 2025
- Average menu prices up 31% since 2020; COGS still ~40% of revenue; margin ~5%
- 68% of independent operators raised prices in the past year, up from 47% the prior year
- Sector lost 9,500 locations in 2025 alone

**The gap:** Owners are raising prices — but uniformly. Everything up 10%, hope volume holds. They are not using contribution margin data to decide *where* the headroom is. Existing tools (Toast, meez, Upserve) all require POS integration and onboarding. There is no tool that works from a copy-pasted menu in 60 seconds.

**Wished state:** Free tool, no POS required, manual menu input, food cost % per item, outputs Stars/Puzzles/Plowhorses/Dogs matrix with plain-English actions. One browser session, no account.

**Distribution:** r/restaurantowners (285K), r/KitchenConfidential (2.4M), r/restaurateur, Independent Restaurant Coalition, Toast community, Restaurant Business Online.

---

### 🇬🇧 United Kingdom

**Market size:** ~90,000 licensed food and drink premises. 51% of owners expect moderate growth in 2026, 20% significant growth — but 50%+ name rising ingredient/energy costs as their biggest challenge.

**The structural cost problem:**
UK restaurants pay 20% VAT on dine-in food — double the EU average of 10%. Labour costs are 35–40% of revenue; food cost benchmarks run 28–38% by format. Almost no margin for pricing errors.

**The regulatory forcing function — DMCCA 2024:**
From 6 April 2025, under the Digital Markets, Competition and Consumers Act 2024, UK restaurants must include all mandatory charges in the upfront menu price. This means the 12.5% service charge — standard across London and major cities — must now be embedded in displayed prices, not added at the bill.

This is law, enforced by the CMA with fines up to 10% of global annual turnover. The CMA has already opened investigations into 8 businesses and sent advisory letters to 100 firms.

**What this means for owners:**
A dish listed at £16 (with 12.5% added at the bill) now needs to be displayed at £18. The problem compounds on higher-priced items: a £26 dish becomes £29.25. That psychological jump from £26 to £29 feels dramatic to guests — even though the *actual price paid is identical*. Owners need to restructure their entire price list using charm pricing and anchoring, under a compliance deadline.

> *"If a restaurant will ask a consumer to pay a total price of £19.11, instead of showing £19.11 in the menu, it shows a misleading price of £16.99 with small print about an additional 12.5% service charge."*
> — UK CMA consultation submission

**Wished state:** Input current prices + service charge % → tool recalculates all items to all-inclusive pricing using charm pricing rules, flags psychological tier jumps, outputs revised price list with margin analysis layered on top. Compliance + psychology in one step.

**Distribution:** BigHospitality.co.uk, UKHospitality forum, r/ChefUK, independent restaurant Facebook groups, The Caterer newsletter.

---

*Up next: 02 — Solution Design*
