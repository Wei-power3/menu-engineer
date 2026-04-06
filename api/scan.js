// Menu photo scan — Gemini 2.5 Flash-Lite extracts item names + prices from a menu image.
// Requires GEMINI_API_KEY in Vercel environment variables.
// Get a free key at: https://aistudio.google.com/apikey
// Returns { items: [{name, price}, ...] } or { items: [], error: string }

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' })
  }

  const { image, mediaType } = req.body || {}

  if (!image || !mediaType) {
    return res.status(400).json({ error: 'image and mediaType are required.' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Menu scan requires a Gemini API key. Please add GEMINI_API_KEY to your Vercel environment variables.' })
  }

  const prompt = `Extract all food and drink items from this menu image.
Return ONLY a valid JSON array, no other text:
[{"name": "House Burger", "price": 16.00}, ...]
Rules:
- Include only items that have a clearly visible price
- price must be a number (no currency symbols)
- Exclude section headings, descriptions, wine lists, and drinks unless they have a specific food price
- If you cannot read the menu clearly, return an empty array []`

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inline_data: {
                    mime_type: mediaType,
                    data: image,
                  },
                },
                { text: prompt },
              ],
            },
          ],
          generationConfig: {
            temperature: 0,
            maxOutputTokens: 1024,
          },
        }),
      }
    )

    if (!response.ok) {
      const errBody = await response.text()
      console.error('Gemini Vision API error:', response.status, errBody)
      return res.status(502).json({
        error: 'Could not scan menu — please add items manually or try again.',
      })
    }

    const data = await response.json()
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

    let items
    try {
      const stripped = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
      items = JSON.parse(stripped)
    } catch {
      return res.status(200).json({
        items: [],
        error: 'Could not read menu — try a clearer photo or add items manually.',
      })
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(200).json({
        items: [],
        error: 'No items found — try a clearer photo or add items manually.',
      })
    }

    return res.status(200).json({ items })
  } catch (err) {
    console.error('Scan handler error:', err)
    return res.status(500).json({
      error: 'Could not scan menu — please add items manually or try again.',
    })
  }
}
