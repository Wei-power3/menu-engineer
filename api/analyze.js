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

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    res.status(500).json({ error: 'Server configuration error: missing API key.' })
    return
  }

  const isUK = market === 'UK'
  const currency = isUK ? 'GBP' : 'USD'
  const currencySymbol = isUK ? '£' : '$'
  const marketLabel = isUK ? 'UK' : 'US'

  const ukComplianceInstruction = isUK
    ? `
For UK menus, also populate the "ukComplianceNote" field for every item. Reference the
Digital Markets, Competition and Consumers Act 2024 (DMCCA 2024), which from April 2025
requires all mandatory charges (including service charges) to be included in the displayed
price. If the item price appears to exclude a service charge, flag it. If price seems
already inclusive, confirm that. Keep notes under 25 words.`
    : ''

  const systemPrompt = `You are a menu engineering expert. Analyse restaurant menu items and classify each as Star, Puzzle, Plowhorse, or Dog using the classic Kasavana & Smith matrix:
- Star: high popularity, high contribution margin
- Puzzle: low popularity, high contribution margin
- Plowhorse: high popularity, low contribution margin
- Dog: low popularity, low contribution margin

Popularity is inferred from: menu position (items listed first sell more), item type (burgers/pizza sell more than offal/unusual items), and price point relative to the menu average (cheaper items tend to sell more).

Contribution margin = price minus food cost amount. Compare each item's margin against the menu average to determine high/low.

Return ONLY valid JSON matching this exact schema. No markdown, no explanation, no code fences:
{
  "summary": {
    "totalItems": number,
    "averageContributionMargin": number,
    "currency": "${currency}",
    "stars": number,
    "puzzles": number,
    "plowhorses": number,
    "dogs": number
  },
  "items": [
    {
      "name": string,
      "price": number,
      "foodCostPct": number,
      "foodCostAmount": number,
      "contributionMargin": number,
      "category": "Star" | "Puzzle" | "Plowhorse" | "Dog",
      "popularityLevel": "high" | "low",
      "marginLevel": "high" | "low",
      "action": string (one sentence, specific and actionable),
      "marketContext": string (one sentence: typical ${marketLabel} price range for this category, honest about uncertainty),
      "priceRecommendation": "hold" | "raise" | "cut",
      "ukComplianceNote": string | null
    }
  ]
}

Rules:
- action must be specific to the item, not generic. E.g. not "Consider a price increase" but "At ${currencySymbol}16 with 40% food cost, raising by ${currencySymbol}1-2 would add meaningful margin without exceeding competitor range."
- marketContext: use your training knowledge of typical ${marketLabel} restaurant pricing for this category and tier. Be honest if uncertain.
- priceRecommendation: "raise" for Plowhorses with room to grow, "cut" for Dogs that may be overpriced, "hold" for Stars and most Puzzles.${ukComplianceInstruction}`

  const userPrompt = `Market: ${marketLabel}\nCurrency: ${currency}\n\nMenu:\n${menuText.trim()}`

  try {
    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }]
      })
    })

    if (!claudeResponse.ok) {
      const errorBody = await claudeResponse.text()
      console.error('Claude API error:', claudeResponse.status, errorBody)
      // Surface the real error so we can debug
      res.status(502).json({
        error: `Anthropic API returned ${claudeResponse.status}`,
        detail: errorBody
      })
      return
    }

    const claudeData = await claudeResponse.json()
    const rawText = claudeData.content?.[0]?.text || ''

    let parsed
    try {
      parsed = JSON.parse(rawText)
    } catch {
      // Claude occasionally wraps JSON in backticks — strip and retry
      const stripped = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
      parsed = JSON.parse(stripped)
    }

    res.status(200).json(parsed)
  } catch (err) {
    console.error('Handler error:', err)
    res.status(500).json({ error: err.message || 'Something went wrong. Please try again.' })
  }
}
