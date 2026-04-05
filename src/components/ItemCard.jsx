import React from 'react'

function getCurrencySymbol(currency) {
  return currency === 'GBP' ? '£' : '$'
}

function getRecommendationLabel(recommendation) {
  if (recommendation === 'raise') return 'Raise price'
  if (recommendation === 'cut') return 'Cut or rethink'
  return 'Hold price'
}

export default function ItemCard({ item, currency }) {
  const symbol = getCurrencySymbol(currency)

  return (
    <div className="item">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'start' }}>
        <strong>{item.name}</strong>
        <span className="muted">{getRecommendationLabel(item.priceRecommendation)}</span>
      </div>

      <p>
        Price: {symbol}
        {Number(item.price).toFixed(2)} · Food cost: {item.foodCostPct}% · Margin: {symbol}
        {Number(item.contributionMargin).toFixed(2)}
      </p>

      <p>{item.action}</p>

      {item.marketContext && <p className="muted">{item.marketContext}</p>}

      {item.ukComplianceNote && (
        <p className="muted">UK note: {item.ukComplianceNote}</p>
      )}
    </div>
  )
}
