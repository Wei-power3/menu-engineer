import React from 'react'

function getCurrencySymbol(currency) {
  return currency === 'GBP' ? '£' : '$'
}

function getRecommendationLabel(recommendation) {
  if (recommendation === 'raise') return 'Raise price'
  if (recommendation === 'cut') return 'Cut or rethink'
  return 'Hold price'
}

export default function ItemCard({ item, currency, avgCM, avgPrice }) {
  const symbol = getCurrencySymbol(currency)

  const marginCmp = item.contributionMargin >= avgCM ? 'above' : 'below'
  const popularityCmp = item.price <= avgPrice ? 'below or equal to' : 'above'
  const reasoning =
    `Margin ${symbol}${Number(item.contributionMargin).toFixed(2)} is ${marginCmp} menu avg ${symbol}${Number(avgCM).toFixed(2)} → ${item.marginLevel} margin. ` +
    `Price ${symbol}${Number(item.price).toFixed(2)} is ${popularityCmp} menu avg ${symbol}${Number(avgPrice).toFixed(2)} → estimated ${item.popularityLevel} popularity.`

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

      <p className="muted" style={{ fontSize: '0.78rem', marginTop: '4px' }}>{reasoning}</p>

      {item.marketContext && <p className="muted">{item.marketContext}</p>}

      {item.ukComplianceNote && (
        <p className="muted">UK note: {item.ukComplianceNote}</p>
      )}
    </div>
  )
}
