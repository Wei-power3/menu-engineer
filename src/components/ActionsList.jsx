import React, { useMemo } from 'react'

export default function ActionsList({ items }) {
  const prioritizedItems = useMemo(() => {
    return [...items].sort((a, b) => Number(a.contributionMargin) - Number(b.contributionMargin))
  }, [items])

  return (
    <section className="card" style={{ marginTop: '24px' }}>
      <h3>Recommended Actions</h3>
      <ol role="list" style={{ display: 'grid', gap: '16px', marginTop: '12px' }}>
        {prioritizedItems.map((item) => (
          <li key={`action-${item.name}`}>
            <strong>{item.name}</strong>
            <p>{item.action}</p>
            {item.marketContext && <p className="muted">{item.marketContext}</p>}
          </li>
        ))}
      </ol>
    </section>
  )
}
