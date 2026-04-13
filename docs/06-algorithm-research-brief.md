# 06 — Algorithm Research Brief

> **For:** External research team (data scientists / algorithm researchers)
> **From:** Product Manager — Menu Engineer
> **Date:** April 2026
> **Project:** Menu Engineer (Algorithm Assessment Phase)
> **Status:** Reviewing existing v1 algorithms.

## 1. Product Context & Goals

Menu Engineer is a decision-support tool for independent restaurant owners. Our goal is to provide **structured, data-driven pricing and menu decisions** in under 60 seconds, without requiring POS integration or complex data entry.

We are currently assessing the effectiveness of our v1 algorithm layer. We need a research team to evaluate our existing logic, identify its advantages and disadvantages, and recommend improvements that stay within our technical constraints.

## 2. Algorithms Under Assessment

We want to get **Algorithms 1, 2, 3, and 4** reviewed. Below is the description of what we are trying to achieve with each.

### Algorithm 1: Food Cost Calculation
**Goal:** Convert an owner's perceived "food cost percentage" into a concrete dollar amount per dish.
**Current Logic:** `foodCostAmount = price × (foodCostPct / 100)`
**Assessment Task:** Evaluate if this simplified input (percentage) is the most effective way to capture cost for small operators, or if there's a higher-integrity method that doesn't add friction.

### Algorithm 2: Contribution Margin Calculation
**Goal:** Determine the actual profit (in dollars) each item contributes to the business after direct food costs.
**Current Logic:** `contributionMargin = price - foodCostAmount`
**Assessment Task:** Confirm if this is the most actionable "profitability" metric for a casual dining operator, or if other overhead variables should be considered.

### Algorithm 3: Margin Classification Threshold
**Goal:** Categorize items as "High Margin" or "Low Margin" relative to the rest of the menu.
**Current Logic:** Using the **arithmetic mean** of all contribution margins as the divider.
**Assessment Task:** Identify the disadvantages of using the mean (e.g., sensitivity to outliers like a $60 steak on a $15 menu) and suggest more robust statistical thresholds (median, weighted averages, etc.).

### Algorithm 4: Popularity Proxy (The "Heuristic")
**Goal:** Categorize items as "High Popularity" or "Low Popularity" **without having sales data**.
**Current Logic:** Using **Price** as a proxy for demand. If `itemPrice <= averageMenuPrice`, it is classified as "High Popularity."
**Assessment Task:** This is our most critical assessment area. We are trying to "guess" popularity based on price. We need the team to identify the pros/cons of this heuristic and research better proxies (menu position, category benchmarks, etc.) that can work without POS data.

## 3. The Research Mandate

We are asking the research team to look into these four algorithms specifically to determine:
1. **Advantages:** Why might these simple approaches work for a v1 product?
2. **Disadvantages:** Where do these models fail? (e.g., poor recommendations, misclassification of "stars").
3. **Accuracy:** How closely do these proxies correlate with real-world restaurant performance?
4. **Alternatives:** What are the validated, research-backed alternatives that can run in a browser (JavaScript) without external data?

## 4. Technical Constraints
- **Input Limit:** We only have `itemName`, `price`, and `foodCost%`. No unit counts.
- **Environment:** Must be a deterministic JavaScript function.
- **Explainability:** An owner must be able to understand *why* a recommendation was made.

## 5. Success Criteria
The team's success is defined by delivering a research memo that justifies a move from "gut-feel heuristics" to "defensible algorithmic logic" for our next version.

---
**References:**
- `src/utils/menuAnalysis.js` (Implementation)
- `docs/01-problem-research.md` (User Context)
- `docs/03-build-plan.md` (Architecture)
