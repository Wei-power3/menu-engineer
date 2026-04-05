function parseMenuText(menuText) {
  const lines = menuText
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  return lines.map((line, index) => {
    const parts = line.split(',').map((part) => part.trim())
    const name = parts[0] || `Item ${index + 1}`

    const priceMatch = line.match(/\$?\s?(\d+(?:\.\d+)?)/)
    const foodCostMatch = line.match(/(\d+(?:\.\d+)?)\s?%/)

    const price = priceMatch ? Number(priceMatch[1]) : 12
    const foodCostPct = foodCostMatch ? Number(foodCostMatch[1]) : 30

    return {
      name,
      price,
      foodCostPct
    }
  })
}

function categorize(index) {
  const categories = ['Star', 'Puzzle', 'Plowhorse', 'Dog']
  return categories[index % categories.length]
}

function levelsForCategory(category) {
  if (category === 'Star') return { popularityLevel: 'high', marginLevel: 'high' }
  if (category === 'Puzzle') return { popularityLevel: 'low', marginLevel: 'high' }
  if (category === 'Plowhorse') return { popularityLevel: 'high', marginLevel: 'low' }
  return { popularityLevel: 'low', marginLevel: 'low' }
}

function actionForCategory(category) {
  if (category === 'Star') return 'Keep price, feature prominently on menu.'
  if (category === 'Puzzle') return 'Test stronger placement or naming to increase orders.'
  if (category === 'Plowhorse') return 'Consider a small price increase or portion tuning.'
  return 'Consider removal, redesign, or limited-time repositioning.'
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed. Use POST.' })
    return
  }

  const { menuText = '', market = 'US' } = req.body || {}

  if (!menuText.trim()) {
    res.status(400).json({ error: 'menuText is required.' })
    return
  }

  const parsedItems = parseMenuText(menuText)
  const currency = market === 'UK' ? 'GBP' : 'USD'

  const items = parsedItems.map((item, index) => {
    const foodCostAmount = Number(((item.price * item.foodCostPct) / 100).toFixed(2))
    const contributionMargin = Number((item.price - foodCostAmount).toFixed(2))
    const category = categorize(index)
    const { popularityLevel, marginLevel } = levelsForCategory(category)

    return {
      name: item.name,
      price: item.price,
      foodCostPct: item.foodCostPct,
      foodCostAmount,
      contributionMargin,
      category,
      popularityLevel,
      marginLevel,
      action: actionForCategory(category),
      marketContext:
        market === 'UK'
          ? 'Comparable UK casual dining items often vary by neighborhood and concept; treat this as directional context.'
          : 'Comparable US casual dining items often vary by city and concept; treat this as directional context.',
      priceRecommendation: category === 'Plowhorse' ? 'increase' : category === 'Dog' ? 'rethink' : 'hold',
      ukComplianceNote:
        market === 'UK'
          ? 'Check service-charge presentation aligns with DMCCA 2024 guidance.'
          : null
    }
  })

  const summary = {
    totalItems: items.length,
    averageContributionMargin: Number(
      (items.reduce((sum, item) => sum + item.contributionMargin, 0) / Math.max(items.length, 1)).toFixed(2)
    ),
    currency,
    stars: items.filter((item) => item.category === 'Star').length,
    puzzles: items.filter((item) => item.category === 'Puzzle').length,
    plowhorses: items.filter((item) => item.category === 'Plowhorse').length,
    dogs: items.filter((item) => item.category === 'Dog').length
  }

  res.status(200).json({ summary, items })
}
