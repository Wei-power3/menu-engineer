import React, { useMemo, useState } from 'react'

function getCurrencySymbol(currency) {
  return currency === 'GBP' ? '£' : '$'
}

function getRecommendationLabel(recommendation) {
  if (recommendation === 'raise') return 'Raise'
  if (recommendation === 'cut') return 'Cut'
  return 'Hold'
}

export default function PriceAdjustmentMap({ items, currency }) {
  const [sortConfig, setSortConfig] = useState({
    key: 'contributionMargin',
    direction: 'asc'
  })

  const symbol = getCurrencySymbol(currency)

  const sortedItems = useMemo(() => {
    const sortableItems = [...items]

    sortableItems.sort((a, b) => {
      const { key, direction } = sortConfig
      const modifier = direction === 'asc' ? 1 : -1

      const numericKeys = ['price', 'foodCostPct', 'contributionMargin']

      if (numericKeys.includes(key)) {
        return (Number(a[key]) - Number(b[key])) * modifier
      }

      return String(a[key] ?? '').localeCompare(String(b[key] ?? '')) * modifier
    })

    return sortableItems
  }, [items, sortConfig])

  const requestSort = (key) => {
    setSortConfig((current) => {
      if (current.key === key) {
        return {
          key,
          direction: current.direction === 'asc' ? 'desc' : 'asc'
        }
      }

      return { key, direction: 'asc' }
    })
  }

  const sortArrow = (key) => {
    if (sortConfig.key !== key) return ''
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓'
  }

  return (
    <section className="card" style={{ marginTop: '24px' }}>
      <h3>Price Adjustment Map</h3>
      <p className="muted">Sorted view of pricing pressure across the menu.</p>

      <div style={{ overflowX: 'auto', marginTop: '12px' }}>
        <table>
          <thead>
            <tr>
              <th>
                <button type="button" onClick={() => requestSort('name')}>
                  Item{sortArrow('name')}
                </button>
              </th>
              <th>
                <button type="button" onClick={() => requestSort('category')}>
                  Category{sortArrow('category')}
                </button>
              </th>
              <th>
                <button type="button" onClick={() => requestSort('price')}>
                  Price{sortArrow('price')}
                </button>
              </th>
              <th>
                <button type="button" onClick={() => requestSort('foodCostPct')}>
                  Food Cost %{sortArrow('foodCostPct')}
                </button>
              </th>
              <th>
                <button type="button" onClick={() => requestSort('contributionMargin')}>
                  Margin{sortArrow('contributionMargin')}
                </button>
              </th>
              <th>
                <button type="button" onClick={() => requestSort('priceRecommendation')}>
                  Recommendation{sortArrow('priceRecommendation')}
                </button>
              </th>
            </tr>
          </thead>

          <tbody>
            {sortedItems.map((item) => (
              <tr key={`map-${item.name}`}>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>
                  {symbol}
                  {Number(item.price).toFixed(2)}
                </td>
                <td>{item.foodCostPct}%</td>
                <td>
                  {symbol}
                  {Number(item.contributionMargin).toFixed(2)}
                </td>
                <td>{getRecommendationLabel(item.priceRecommendation)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
