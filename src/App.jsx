import React, { useMemo, useState } from 'react'
import MenuInputForm from './components/MenuInputForm'
import useMenuAnalysis from './hooks/useMenuAnalysis'

const CATEGORY_ORDER = ['Star', 'Puzzle', 'Plowhorse', 'Dog']

export default function App() {
  const [menuText, setMenuText] = useState('')
  const [market, setMarket] = useState('US')
  const { data, error, loading, analyzeMenu, clearData } = useMenuAnalysis()

  const groupedItems = useMemo(() => {
    const groups = {
      Star: [],
      Puzzle: [],
      Plowhorse: [],
      Dog: []
    }

    if (!data?.items) {
      return groups
    }

    data.items.forEach((item) => {
      if (groups[item.category]) {
        groups[item.category].push(item)
      }
    })

    return groups
  }, [data])

  const handleSubmit = async (event) => {
    event.preventDefault()
    await analyzeMenu({ menuText, market })
  }

  return (
    <div className="app">
      <header className="hero">
        <h1>Menu Engineer</h1>
        <p>Paste your menu. Find out what's bleeding margin, what's underpriced, and what to cut.</p>
      </header>

      {!data && (
        <MenuInputForm
          menuText={menuText}
          market={market}
          onMenuTextChange={setMenuText}
          onMarketChange={setMarket}
          onSubmit={handleSubmit}
          loading={loading}
        />
      )}

      {loading && <p className="status">Analyzing your menu...</p>}

      {error && <p className="error">{error}</p>}

      {data && (
        <section className="results" aria-live="polite">
          <div className="results-header">
            <h2>Analysis Results</h2>
            <button
              type="button"
              className="button secondary"
              onClick={() => {
                clearData()
              }}
            >
              Analyze another menu
            </button>
          </div>

          <p>
            {data.summary.totalItems} items analyzed • Average contribution margin:{' '}
            <strong>
              {data.summary.currency === 'GBP' ? '£' : '$'}
              {Number(data.summary.averageContributionMargin).toFixed(2)}
            </strong>
          </p>

          <div className="grid">
            {CATEGORY_ORDER.map((category) => (
              <article key={category} className="card">
                <h3>
                  {category}s ({groupedItems[category].length})
                </h3>

                {groupedItems[category].length === 0 && <p className="muted">No items in this category.</p>}

                {groupedItems[category].map((item) => (
                  <div key={item.name} className="item">
                    <strong>{item.name}</strong>
                    <p>
                      Price: {data.summary.currency === 'GBP' ? '£' : '$'}
                      {item.price} · Margin: {data.summary.currency === 'GBP' ? '£' : '$'}
                      {Number(item.contributionMargin).toFixed(2)}
                    </p>
                    <p>{item.action}</p>
                    <p className="muted">{item.marketContext}</p>
                  </div>
                ))}
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
