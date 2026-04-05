import React, { useMemo, useState } from 'react'
import MenuInputForm from './components/MenuInputForm'
import AnalysisMatrix from './components/AnalysisMatrix'
import PriceAdjustmentMap from './components/PriceAdjustmentMap'
import ActionsList from './components/ActionsList'
import ErrorMessage from './components/ErrorMessage'
import PdfDownloadButton from './components/PdfDownloadButton'
import useMenuAnalysis from './hooks/useMenuAnalysis'

const CATEGORY_ORDER = ['Star', 'Puzzle', 'Plowhorse', 'Dog']

export default function App() {
  const [market, setMarket] = useState('US')
  const { data, error, analyzeMenu, clearData } = useMenuAnalysis()

  const groupedItems = useMemo(() => {
    const groups = { Star: [], Puzzle: [], Plowhorse: [], Dog: [] }
    if (!data?.items) return groups
    data.items.forEach((item) => {
      if (groups[item.category]) groups[item.category].push(item)
    })
    return groups
  }, [data])

  const handleSubmit = (items, selectedMarket) => {
    setMarket(selectedMarket)
    analyzeMenu(items, selectedMarket)
  }

  return (
    <div className="app">
      <header className="hero">
        <h1>Menu Engineer</h1>
        <p>
          Paste your menu. Find out what&apos;s bleeding margin, what&apos;s underpriced,
          and what to cut.
        </p>
      </header>

      {!data && (
        <MenuInputForm
          market={market}
          onMarketChange={setMarket}
          onSubmit={handleSubmit}
        />
      )}

      {error && <ErrorMessage message={error} onRetry={clearData} />}

      {data && (
        <section className="results" aria-live="polite">
          <div className="results-header">
            <div>
              <h2>Analysis Results</h2>
              <p className="results-summary">
                {data.summary.totalItems} items analyzed &bull; Average contribution margin:{' '}
                <strong>
                  {data.summary.currency === 'GBP' ? '\u00a3' : '$'}
                  {Number(data.summary.averageContributionMargin).toFixed(2)}
                </strong>
              </p>
            </div>

            <div className="results-actions">
              <PdfDownloadButton data={data} />
              <button
                type="button"
                className="button secondary"
                onClick={clearData}
              >
                Analyze another menu
              </button>
            </div>
          </div>

          <p className="muted" style={{ fontSize: '0.8rem', marginBottom: '8px' }}>
            ⚠️ Popularity is estimated from price position, not actual sales data. For higher accuracy, sales volume input is planned for a future update.
          </p>

          <AnalysisMatrix
            groupedItems={groupedItems}
            currency={data.summary.currency}
            avgCM={data.summary.averageContributionMargin}
            avgPrice={data.summary.averagePrice}
            categoryOrder={CATEGORY_ORDER}
          />

          <p className="muted" style={{ fontSize: '0.78rem', marginTop: '8px' }}>
            Analysis based on the Kasavana &amp; Smith (1982) menu engineering framework — the industry standard since Cornell University&apos;s School of Hotel Administration.
          </p>

          <PriceAdjustmentMap
            items={data.items}
            currency={data.summary.currency}
          />

          <ActionsList items={data.items} />
        </section>
      )}
    </div>
  )
}
