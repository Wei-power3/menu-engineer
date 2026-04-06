import React from 'react'
import ItemCard from './ItemCard'

const CATEGORY_LABELS = {
  Star: 'Stars',
  Puzzle: 'Puzzles',
  Plowhorse: 'Plowhorses',
  Dog: 'Dogs'
}

export default function AnalysisMatrix({
  groupedItems,
  currency,
  avgCM,
  avgPrice,
  categoryOrder = ['Star', 'Puzzle', 'Plowhorse', 'Dog']
}) {
  return (
    <section>
      <h3>Menu Matrix</h3>
      <div className="grid">
        {categoryOrder.map((category) => {
          const items = (groupedItems[category] || []).filter((item) => item && item.name)

          return (
            <article key={category} className="card">
              <h3>
                {CATEGORY_LABELS[category]} ({items.length})
              </h3>

              {items.length === 0 && (
                <p className="muted">No items in this category.</p>
              )}

              {items.map((item) => (
                <ItemCard
                  key={`${category}-${item.name}`}
                  item={item}
                  currency={currency}
                  avgCM={avgCM}
                  avgPrice={avgPrice}
                />
              ))}
            </article>
          )
        })}
      </div>
    </section>
  )
}
