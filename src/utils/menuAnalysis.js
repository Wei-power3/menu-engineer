// Pure menu engineering logic — no LLM required.
// Popularity is estimated from relative price: items at or below the average price
// sell more than pricier items. This is a known heuristic; accuracy improves with
// real sales data (future enhancement).

const ACTION_TEMPLATES = {
  Star: (item, sym) =>
    `${item.name} is your top performer. Keep the price at ${sym}${item.price.toFixed(2)}, give it prime menu placement, and consider highlighting it visually.`,
  Puzzle: (item, sym) =>
    `${item.name} has strong margin (${sym}${item.contributionMargin.toFixed(2)}) but low visibility. Move it higher on the menu or add a compelling description to drive orders.`,
  Plowhorse: (item, sym) =>
    `${item.name} is popular but thin on margin at ${sym}${item.contributionMargin.toFixed(2)} CM. Try raising the price by ${sym}1–2 or reducing the portion slightly.`,
  Dog: (item, sym) =>
    `${item.name} is low-margin and low-popularity. Consider removing it from the menu or repricing to justify its place.`,
}

const PRICE_RECOMMENDATIONS = {
  Star: 'hold',
  Puzzle: 'hold',
  Plowhorse: 'raise',
  Dog: 'cut',
}

export function analyzeMenu(items, market) {
  const isUK = market === 'UK'
  const sym = isUK ? '£' : '$'
  const currency = isUK ? 'GBP' : 'USD'

  // Step 1: calculate food cost amount and contribution margin
  const enriched = items.map((item) => {
    const foodCostAmount = parseFloat((item.price * (item.foodCostPct / 100)).toFixed(2))
    const contributionMargin = parseFloat((item.price - foodCostAmount).toFixed(2))
    return { ...item, foodCostAmount, contributionMargin }
  })

  // Step 2: averages for classification thresholds
  const avgCM = enriched.reduce((sum, i) => sum + i.contributionMargin, 0) / enriched.length
  const avgPrice = enriched.reduce((sum, i) => sum + i.price, 0) / enriched.length

  // Step 3: classify each item
  const classified = enriched.map((item) => {
    const marginLevel = item.contributionMargin >= avgCM ? 'high' : 'low'
    const popularityLevel = item.price <= avgPrice ? 'high' : 'low'

    const category =
      marginLevel === 'high' && popularityLevel === 'high' ? 'Star' :
      marginLevel === 'high' && popularityLevel === 'low'  ? 'Puzzle' :
      marginLevel === 'low'  && popularityLevel === 'high' ? 'Plowhorse' :
      'Dog'

    return {
      ...item,
      marginLevel,
      popularityLevel,
      category,
      action: ACTION_TEMPLATES[category](item, sym),
      priceRecommendation: PRICE_RECOMMENDATIONS[category],
      marketContext: null,
      ukComplianceNote: null,
    }
  })

  const summary = {
    totalItems: classified.length,
    averageContributionMargin: parseFloat(avgCM.toFixed(2)),
    averagePrice: parseFloat(avgPrice.toFixed(2)),
    currency,
    stars:       classified.filter((i) => i.category === 'Star').length,
    puzzles:     classified.filter((i) => i.category === 'Puzzle').length,
    plowhorses:  classified.filter((i) => i.category === 'Plowhorse').length,
    dogs:        classified.filter((i) => i.category === 'Dog').length,
  }

  return { summary, items: classified }
}
