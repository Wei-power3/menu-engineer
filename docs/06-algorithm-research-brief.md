# 06 — Algorithm Research Brief (Product Manager Review)

**To:** External Research Team
**From:** Product Manager — Menu Engineer
**Date:** April 2026
**Subject:** Assessment of v1 Core Algorithms (1, 2, 3, and 4)

---

## 1. Product Context & Strategic Goal
Menu Engineer is designed for **independent restaurant owners** who currently set prices based on "gut feel" or uniform increases. Our product goal is to provide a **structured, data-driven analysis in under 60 seconds** with zero friction (no POS integration, no registration).

We are currently in an **assessment phase**. We need to determine if our current v1 algorithms are providing high-integrity guidance or if they contain systemic flaws that could lead to poor business decisions.

## 2. Goals & Context for Algorithms 1-4
We require a detailed review of the following four algorithms to understand their **advantages and disadvantages** in a real-world restaurant context.

### Algorithm 1: Food Cost Amount Calculation
*   **Goal:** Convert the user's "Food Cost %" into a dollar-denominated cost baseline without requiring a full recipe breakdown.
*   **Logic:** `foodCostAmount = price * (foodCostPct / 100)`
*   **Context:** Most owners know their target % but not their exact dish cost. We use this to lower the barrier to entry.
*   **Assessment Task:** Identify the advantages of this "low-friction" entry vs. the disadvantages of accuracy drift if the owner's % estimate is wrong.

### Algorithm 2: Contribution Margin (CM)
*   **Goal:** Provide a "profit-per-plate" metric that owners can use to prioritize high-value items.
*   **Logic:** `contributionMargin = price - foodCostAmount`
*   **Context:** This is the core variable used for all subsequent classifications (Stars, Puzzles, etc.).
*   **Assessment Task:** Evaluate the disadvantage of ignoring labor/overhead in this calculation. Is "Contribution Margin" the right north-star metric for a small operator?

### Algorithm 3: Margin Classification Threshold
*   **Goal:** Deterministically split the menu into "High Margin" and "Low Margin" categories.
*   **Logic:** `avgCM = arithmetic mean of all item CMs`. If `itemCM >= avgCM`, it's High Margin.
*   **Context:** We need a binary threshold to populate the 2x2 matrix.
*   **Assessment Task:** Research the disadvantages of using the **arithmetic mean** (e.g., sensitivity to outliers). Compare with the advantages/disadvantages of using the **median** or a weighted average.

### Algorithm 4: Popularity Proxy (Heuristic)
*   **Goal:** Categorize items as "High Popularity" or "Low Popularity" **without access to sales data**.
*   **Logic:** If `itemPrice <= averageMenuPrice`, the item is classified as "High Popularity."
*   **Context:** Since we have no POS data, we use price as a proxy for demand (cheaper = more popular).
*   **Assessment Task:** This is our highest-risk area. Identify the massive disadvantages of this heuristic (e.g., a popular $25 steak being labeled "unpopular"). Research any research-backed "no-data" proxies (position, category, protein type) that could mitigate these disadvantages.

## 3. The Research Mandate
The research team is tasked with assessing these four algorithms through the lens of:
1.  **Advantages:** Why do these work for a v1 "quick-start" tool?
2.  **Disadvantages:** Where do these models fail to represent restaurant reality?
3.  **Risk Assessment:** What is the likelihood that these algorithms produce a "wrong" recommendation (e.g., telling an owner to cut a popular Star because it's priced high)?

## 4. Technical Constraints
*   **Data:** No sales volume, no POS, no historical trends.
*   **Environment:** Browser-based JavaScript (deterministic).
*   **User:** Non-technical restaurant owners who need explainable results.

---
**References for Review:**
*   `src/utils/menuAnalysis.js`
*   `docs/01-problem-research.md`
*   `CLAUDE.md` (Known Weaknesses section)
